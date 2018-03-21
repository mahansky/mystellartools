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
              nodes.push(h(
                'li',
                {attrs: {'class': 'small-public-key'}},
                this.publicKeyComponent(h, node)
              ))
            } else {
              nodes.push(h('li', [h('ul', this.createChildrenElements(h, node))]))
            }
          })

          return [main, ...nodes]
        },

        publicKeyComponent (h, key) {
          if (key.length > 5) {
            return [h('public-key', {props: {value: key}})]
          }

          return key
        },
      },
    }
</script>