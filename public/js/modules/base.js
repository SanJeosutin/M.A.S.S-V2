import { Vector2D } from './vector2d.js';
import { egi } from './graphics.js';

export class Base {
    static nextId = 1;

    constructor(world) {
        this.world = world;

        this.id = Base.nextId++;
        this.name = 'Base No.' + this.id;
        this.radius = 25;
        this.position = new Vector2D(Math.random() * world.cx, Math.random() * world.cy);

        this.inventory = [];
        this.residents = [];

        const palette = Object.keys(egi.colors);
        const randomIndex = Math.floor(Math.random() * palette.length);

        this.color = palette[randomIndex];
    }

    update() {
        this.inventory.sort(function (a, b) {
            return b.value - a.value;
        });
    }

    /**
     * Find first item index that boosts the given stat
     * Returns -1 if none
     */
    findItemIndexByStat(statName) {
        for (var i = 0; i < this.inventory.length; i++) {
            if (this.inventory[i].stats[statName] > 0) {
                return i;
            }
        }
        return -1;
    }

    render() {
        egi.setColor(this.color);
        egi.setStrokeWidth(2);
        egi.drawRhombus(this.position, this.radius * 2, this.radius * 2);
        egi.drawText(this.position.x - this.radius, this.position.y - this.radius - 5, this.name);

        if (this.world.showInfo) {
            var textX = this.position.x + this.radius + 5;
            var textY = this.position.y - this.radius - 5;

            egi.setColor('AQUA');
            for (var i = 0; i < this.residents.length; i++) {
                var agent = this.residents[i];
                var line = 'Agent' + agent.id + ' holds: ' + (agent.inventory.map(function (it) { return it.name; }).join(', ') || 'None');
                egi.drawText(textX, textY, line);
                textY += 14;
            }

            var stored = this.inventory.map(function (it) { return it.name; }).join(', ');
            if (!stored) { stored = 'None'; }
            egi.drawText(textX, textY, 'Stored: ' + stored);
        }
    }
}
