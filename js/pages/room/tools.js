function rollDie(size) {
    return Math.floor(Math.random() * size) + 1;
}

function rollDice(size, quantity) {
    return R.map(i => rollDie(size), R.range(0, quantity));
}

export default {
    template: /*html*/`
        <div class="tool-list">
            <div class="tool">
                <label class="label"><fa icon="random"/> Flip a coin:</label>
                <button class="button is-info is-fullwidth" @click="flip" style="font-size: 1.25em">
                    Flip!
                </button>
                <br>
                <div class="flips">
                    <div v-for="(isHead, i) in flips" :key="i" class="notification has-text-centered" :class="isHead ? 'is-light' : 'is-dark'">
                        <fa :icon="isHead ? 'arrow-up' : 'arrow-down'"/> {{ isHead ? 'Heads' : 'Tails' }}
                    </div>
                </div>
            </div>
            <div class="tool">
                <label class="label"><fa icon="dice"/> Roll dice:</label>
                <div class="columns is-mobile is-variable is-1">
                    <div class="column">
                        <div class="select is-fullwidth">
                            <select class="" v-model="roll.quantity">
                                <option v-for="n in R.range(1, 21)" :key="n" :value="n">{{ n }} dice</option>
                            </select>
                        </div>
                    </div>
                    <div class="column">
                        <div class="select is-fullwidth">
                            <select class="" v-model="roll.size">
                                <option v-for="n in R.range(2, 21)" :key="n" :value="n">{{ n }} sides</option>
                            </select>
                        </div>
                    </div>
                    <div class="column is-narrow">
                        <button class="button is-info" @click="rollDice">
                            <fa icon="dice"/>
                        </button>
                    </div>
                </div>
                <div class="notification is-light" v-if="roll.rolling || roll.result.length > 0" style="font-size: 20px">
                    <span v-if="roll.rolling">
                         Rolling {{ roll.quantity }} {{ 'die' | pluralize(roll.quantity, 'dice') }}...
                    </span>
                    <span v-else>
                        <p>Your {{ 'roll' | pluralize(roll.quantity) }}:</p>
                        <p><strong>{{ roll.result.join(', ') }}</strong></p>
                    </span>
                </div>
            </div>
        </div>
    `,
    props: ['room'],
    data: function() {
        return {
            flips: [],
            roll: {
                size: 6,
                quantity: 1,
                result: [],
                rolling: false,
            }
        }
    },
    methods: {
        flip() {
            const flip = rollDie(2) === 1 ? true : false;
            this.flips.unshift(flip);
            setTimeout(() => this.flips.pop(), 10000);
        },
        rollDice() {
            // small delay to provide feedback on re-rolls
            const rollDelay = 500;
            this.flashSet(this.roll, 'rolling', true, false, rollDelay / 1000);
            setTimeout(() => this.roll.result = rollDice(this.roll.size, this.roll.quantity).sort((a, b) => a - b), rollDelay);
        },
    }
}