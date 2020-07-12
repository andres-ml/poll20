import CooldownTracker from '../../components/cooldown-tracker.js'
import DiceRoll from '../../components/dice-roll.js'

export default {
    components: {
        CooldownTracker,
        DiceRoll,
    },
    template: /*html*/`
        <div class="tool-list">
        <cooldown-tracker/>
            <dice-roll/>
        </div>
    `,
}