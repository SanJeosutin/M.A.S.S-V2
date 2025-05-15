import { egi } from './utils/graphics.js';

export var ITEM_DEFINITIONS = {
    food: {
        'Meat': { hunger: 45, thirst: -10, energy: 10, health: 5 },
        'Cake': { hunger: 30, thirst: -15, energy: 5, health: 5 },
        'Fruit': { hunger: 20, thirst: 10, energy: 10, health: 0 },
        'nuts': { hunger: 15, thirst: -20, energy: 0, health: 0 },
    },

    drink: {
        'E-drink': { hunger: 0, thirst: 15, energy: 65, health: -10 },
        'water': { hunger: 0, thirst: 65, energy: 0, health: 0 },
        'coffee': { hunger: 0, thirst: 10, energy: 45, health: -5 },
        'tea': { hunger: 0, thirst: 35, energy: 25, health: 15 },
        'soda': { hunger: 0, thirst: 20, energy: 10, health: -5 }
    },

    medicine: {
        'bandage': { hunger: 0, thirst: 0, energy: 5, health: 25 },
        'antibiotic': { hunger: 0, thirst: 0, energy: 0, health: 40 },
        'vitamins': { hunger: 5, thirst: 0, energy: 10, health: 15 }
    },
};

// Precompute global min/max average once
const allAverages = [];
for (const category of Object.values(ITEM_DEFINITIONS)) {
    for (const stats of Object.values(category)) {
        const avg = (stats.hunger + stats.thirst + stats.energy + stats.health) / 4;
        allAverages.push(avg);
    }
}
const MIN_AVG = Math.min(...allAverages);
const MAX_AVG = Math.max(...allAverages);

export class Item {
    constructor(world, type, name, stats) {
        this.world = world;
        this.type = type;
        this.name = name;
        this.stats = stats;
        this.radius = 5;
        this.position = new Vector2D(
            Math.random() * world.cx,
            Math.random() * world.cy
        );
        // compute this item's own average:
        this.value = (stats.hunger + stats.thirst + stats.energy + stats.health) / 4;
    }

    update() { }

    render() {
        // normalise into [0..1]
        let t = (this.value - MIN_AVG) / (MAX_AVG - MIN_AVG);
        t = Math.max(0, Math.min(1, t));

        // interpolate red to green based on avg.
        const r = Math.round((1 - t) * 255);
        const g = Math.round(t * 255);
        const hex = `#${r.toString(16).padStart(2, '0')}`
            + `${g.toString(16).padStart(2, '0')}00`;

        // use the raw hex on the canvas
        egi.context.strokeStyle = hex;
        egi.context.fillStyle = hex;
        egi.setStrokeWidth(1);

        // draw a filled circle
        egi.drawCircle(this.position, this.radius, true);

        // label in black (or pick contrasting color as you like)
        egi.context.fillStyle = '#ffffff';
        egi.drawText(
            this.position.x + this.radius + 2,
            this.position.y + 4,      // tweak for vertical centering
            this.name,
            'left'
        );
    }
}