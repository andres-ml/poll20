const About = {
    template: /*html*/`
        <section class="section">
            <div class="container">
                about page <fa :icon="'user'" :modifiers="['has-text-info']"/>
            </div>
            <div class="container">
                <select class="select" v-model="state.a">
                    <option value="1">1</option>
                    <option value="2">2</option>
                </select>
            </div>
        </section>
    `,
    props: ['state']
}
  
export default About