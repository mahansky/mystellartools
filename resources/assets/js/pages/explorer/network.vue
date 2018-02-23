<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex>
                        <div class="display-2">Stellar Network</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container class="mt-3">
            <v-layout>
                <v-flex xs12>
                    <span v-if="nodes.length === 0"
                          class="grey--text">Node watching over the network is currently down.</span>

                    <d3-network v-else :net-nodes="nodes" :net-links="links" :options="options"></d3-network>
                </v-flex>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
  import axios from 'axios'
  import D3Network from 'vue-d3-network'

  export default {
    metaInfo: () => ({
      title: 'Stellar Network',
    }),

    layout: 'default',

    components: {
      D3Network,
    },

    data: () => ({
      nodes: [],
      options: {
        force: 3000,
        nodeSize: 20,
        nodeLabels: true,
        linkWidth: 5
      },
    }),

    computed: {
      links () {
        let links = []

        this.nodes.forEach(node => {
          if (node.ledger && node.ledger.quorum) {
             node.ledger.quorum.v.forEach(peer => {
               let otherNode = this.findNodeByPublicKey(peer)
               
               if (otherNode) {
                 links.push({
                   sid: node.id,
                   tid: otherNode.id
                 })
               }
             })
          }
        })

        return links
      },
    },

    methods: {
      findNodeByPublicKey(publicKey) {
        return this.nodes.find(node => node.public_key === publicKey)
      },
    },

    created () {
      axios.get('/api/peers')
        .then(response => {
          this.nodes = response.data
        })
    }
  }
</script>