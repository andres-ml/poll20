export default {
    template: /*html*/`
        <div class="game-item">
            <div class="columns is-vcentered is-mobile">
                <div class="column is-narrow">
                a
                </div>
                <div class="column">
                    <div class="title">{{ game.name }}</div>
                </div>
                <div class="column is-narrow">
                    ^ / v
                </div>
            </div>
        </div>
    `,
    props: ['game'],
}