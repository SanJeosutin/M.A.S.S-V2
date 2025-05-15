import { Vector2D } from './vector2d.js';
import { egi } from './graphics.js';
import { Inventory } from './inventory.js';


export class Agent {
    static nextId = 1;
    static INVENTORY_CAPACITY = 5;

    // All formerly “magic” thresholds in one place:
    static CONFIG = {
        STAT_MAX: 100,
        ENERGY_LOW_FRAC: 0.25,   // 25% of max energy
        THIRST_LOW_FRAC: 0.50,   // 50% of max thirst
        HUNGER_LOW_FRAC: 0.50,   // 50% of max hunger
        CRY_RANGE: 200,
        RETURN_MARGIN: 15,
        VIEW_RANGE: 100,
        WANDER_JITTER: 0.2,
        PICKUP_RANGE: 6,
        HELP_RADIUS: 10,
    };

    constructor(position, world, home) {
        this.world = world;
        this.home = home;
        this.id = Agent.nextId++;
        this.color = home.color;
        this.config = Agent.CONFIG;

        // initialize all stats at STAT_MAX
        this.stateVars = {
            energy: this.config.STAT_MAX,
            health: this.config.STAT_MAX,
            hunger: this.config.STAT_MAX,
            thirst: this.config.STAT_MAX
        };

        this.isDead = false;
        this.isCrying = false;
        this.cryRange = this.config.CRY_RANGE;

        this.inventory = new Inventory(Agent.INVENTORY_CAPACITY);

        this.position = position.clone();
        this.velocity = new Vector2D(0, 0);

        // rates & multipliers
        this.baseSpeed = 50;
        this.speedMult = 1.0;
        this.drainRate = 0.1;
        this.hungerRate = 1.0;
        this.thirstRate = 1.5;
        this.healthDrain = 5.0;
        this.viewRange = this.config.VIEW_RANGE;

        this.returnMargin = this.config.RETURN_MARGIN;

        this.currentPlan = [];
        this.nextTarget = null;
        this.wanderAngle = Math.random() * Math.PI * 2;

    }

    update(delta) {
        if (this.isDead) return;

        this.wander(delta);
    }


    wander(delta) {
        // clear any residual plan
        this.currentPlan = [];

        // jitter the wander angle
        const maxJitter = 0.2;
        const jitter = (Math.random() * 2 - 1) * maxJitter;
        this.wanderAngle += jitter;

        // move along that heading
        const dist = this.baseSpeed * this.speedMult * delta;
        const dx = Math.cos(this.wanderAngle) * dist;
        const dy = Math.sin(this.wanderAngle) * dist;

        this.velocity = new Vector2D(dx, dy);
        this.position = this.position.add(this.velocity);
    }

    render() {
        if (this.isDead) { return; }

        // Draw next-target guide line
        if (this.nextTarget) {
            egi.setColor(this.color);
            egi.context.save();
            egi.context.setLineDash([5, 5]);
            egi.context.beginPath();
            egi.context.moveTo(this.position.x, this.position.y);
            egi.context.lineTo(this.nextTarget.x, this.nextTarget.y);
            egi.context.stroke();
            egi.context.setLineDash([]);
            egi.context.restore();
        }

        // figure out heading angle from velocity (fallback to 0)
        const angle = this.velocity.length() > 0
            ? Math.atan2(this.velocity.y, this.velocity.x)
            : 0;

        const size = 8; // distance from center to tip

        // precompute cos/sin
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        // local-space triangle points
        const localPts = [
            { x: size, y: 0 },  // tip
            { x: -size * 0.5, y: size * 0.5 }, // rear-left
            { x: -size * 0.5, y: -size * 0.5 }  // rear-right
        ];

        // rotate & translate into world-space
        const worldPts = localPts.map(pt => {
            const rx = pt.x * cos - pt.y * sin;
            const ry = pt.x * sin + pt.y * cos;
            return new Vector2D(rx + this.position.x, ry + this.position.y);
        });

        // draw via graphics.js
        egi.setColor(this.color);
        egi.setStrokeWidth(1);
        egi.drawTriangle(worldPts[0], worldPts[1], worldPts[2], true);

        // Debug viewport & heading
        if (this.world.debugEnabled) {
            egi.setColor('AQUA');
            egi.drawCircle(this.position, this.viewRange);
            let hd = this.velocity.normalize();
            let hx = this.position.x + hd.x * 20;
            let hy = this.position.y + hd.y * 20;
            egi.context.beginPath();
            egi.context.moveTo(this.position.x, this.position.y);
            egi.context.lineTo(hx, hy);
            egi.context.stroke();
            egi.drawText(
                this.position.x + 8, this.position.y + 14,
                'Spd:' + this.velocity.length().toFixed(1)
            );
        }

        if (this.world.showInfo) {
            // map each stat to an emoji
            const icons = {
                energy: '⚡',
                health: '❤️',
                hunger: '🍗',
                thirst: '💧',
                inventory: '🎒'
            };

            // round your stats and build the line
            const energy = Math.round(this.stateVars.energy);
            const health = Math.round(this.stateVars.health);
            const hunger = Math.round(this.stateVars.hunger);
            const thirst = Math.round(this.stateVars.thirst);
            const inventory = this.inventory.length;

            const info = [
                `A-${this.id}`,
                `${icons.energy}${energy}`,
                `${icons.health}${health}`,
                `${icons.hunger}${hunger}`,
                `${icons.thirst}${thirst}`,
                `${icons.inventory}${inventory}`
            ].join(' ');

            egi.setColor('ORANGE');
            egi.drawText(
                this.position.x + 8,
                this.position.y,
                info
            );
        }
    }
}
