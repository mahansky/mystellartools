<script>
    export default {
      props: ['quorum'],

      render (h) {
        return h('ul', this.createChildrenElements(h, this.quorum))
      },

      methods: {
        createChildrenElements (h, quorum) {
          let main = h(
            'li',
            {attrs: {'class': 'small-public-key'}},
            `Nodes: ${quorum.v.length} (must agree: ${quorum.t})`
          )

          let nodes = []

          quorum.v.forEach(node => {
            if (typeof node === 'string') {
              nodes.push(h('li', {attrs: {'class': 'small-public-key'}}, node))
            } else {
              nodes.push(h('li', [h('ul', this.createChildrenElements(h, node))]))
            }
          })

          return [main, ...nodes]
        },
      },
    }
</script>