<template>
    <div>
        <div class="pattern py-5">
            <v-container>
                <v-layout>
                    <v-flex lg12 xl10 offset-xl1>
                        <div class="display-2">
                            Stellar Network
                        </div>
                        <div @click="helpDialog = true" class="grey--text pointer mt-2">Add your node</div>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

        <v-container class="mt-3">
            <v-layout>
                <v-flex lg12 xl10 offset-xl1>
                    <v-btn loading flat class="blue--text" v-if="loading"></v-btn>
                    <template v-else>
                        <span v-if="nodes.length === 0" class="grey--text">
                            Node watching the network is currently offline.
                        </span>
                        <div v-else ref="network"></div>
                    </template>
                </v-flex>
            </v-layout>
        </v-container>

        <v-dialog v-model="nodeDialog" v-if="selectedNode" width="500px" lazy absolute>
            <v-card>
                <v-card-title>
                    <div class="headline" v-text="selectedNode.label ? selectedNode.label : selectedNode.public_key"></div>
                </v-card-title>
                <v-card-text>
                    <table class="first-padding">
                        <tr>
                            <td width="100"><b>Status</b></td>
                            <td
                                :style="ledgerStatus(selectedNode.ledger).style"
                                v-text="ledgerStatus(selectedNode.ledger).text"
                            ></td>
                        </tr>
                        <tr>
                            <td><b>IP:Port</b></td>
                            <td v-text="selectedNode.ip + ':' + selectedNode.port"></td>
                        </tr>
                        <tr>
                            <td valign="top"><b>Core</b></td>
                            <td class="break-all" v-text="selectedNode.version"></td>
                        </tr>
                        <tr>
                            <td valign="top"><b>Public key</b></td>
                            <td class="break-all" v-text="selectedNode.public_key"></td>
                        </tr>
                    </table>
                </v-card-text>
                <v-expansion-panel v-if="ledgers.length" class="mt-4 mb-4">
                    <v-expansion-panel-content v-for="ledger in ledgers" :key="ledger.id">
                        <div slot="header">
                            <v-icon :style="ledgerStatus(ledger).style">stop</v-icon>
                            <span v-text="ledger.ledger"></span>
                        </div>
                        <v-card>
                            <v-card-text class="grey lighten-3 pl-5 pr-5">
                                <table width="100%" class="left-and-right">
                                    <tr v-if="ledger.hash">
                                        <td><b>Hash</b></td>
                                        <td v-text="ledger.hash"></td>
                                    </tr>
                                    <tr v-if="ledger.phase">
                                        <td><b>Phase</b></td>
                                        <td v-text="ledger.phase"></td>
                                    </tr>
                                    <tr v-if="ledger.agree">
                                        <td><b>Agree</b></td>
                                        <td v-text="ledger.agree"></td>
                                    </tr>
                                    <tr v-if="ledger.fail_at">
                                        <td><b>Fail at</b></td>
                                        <td v-text="ledger.fail_at"></td>
                                    </tr>
                                    <tr v-if="ledger.value">
                                        <td><b>Nodes in quorum</b></td>
                                        <td v-text="ledger.value.keys().length"></td>
                                    </tr>
                                </table>
                            </v-card-text>
                            <template v-if="ledger.disagree || ledger.missing">
                                <v-divider></v-divider>
                                <v-card-text class="grey lighten-3 pl-5 pr-5">
                                    <table width="100%" class="left-and-right">
                                        <template v-if="ledger.disagree">
                                            <tr>
                                                <td class="mb-1"><b>Disagree</b></td>
                                                <td class="mb-1" v-text="ledger.disagree.length"></td>
                                            </tr>
                                            <tr v-for="pk in ledger.disagree">
                                                <td colspan="2" class="dense" v-text="pk"></td>
                                            </tr>
                                        </template>
                                        <template v-if="ledger.missing">
                                            <tr>
                                                <td class="mb-1"><b>Missing</b></td>
                                                <td class="mb-1" v-text="ledger.missing.length"></td>
                                            </tr>
                                            <tr v-for="pk in ledger.missing">
                                                <td colspan="2" class="dense" v-text="pk"></td>
                                            </tr>
                                        </template>
                                    </table>
                                </v-card-text>
                            </template>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-card-text>
                    <div class="grey--text">
                        Last updated <span v-text="selectedNode.updated_at"></span>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn loading flat class="blue--text pull-right" v-if="ledgersLoading"></v-btn>
                    <v-btn class="grey--text" flat @click.native="nodeDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="helpDialog" width="500px" lazy absolute>
            <v-card>
                <v-card-title>
                    <div class="headline">Add your node</div>
                </v-card-title>
                <v-card-text>
                    <p>
                        Add <code>173.212.239.196:11627</code> to <code>KNOWN_PEERS</code> in your stellar-core.cfg
                    </p>
                    <p>
                        If you don't want to modify your config file,
                        send us IP:PORT of your stellar-core node to contact@mystellar.tools
                    </p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn class="grey--text" flat @click.native="helpDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
  import axios from 'axios'
  import vis from 'vis'
  import { nodes as knownNodes, groups as knownGroups } from '~/stellar/network_nodes'

  export default {
    metaInfo: () => ({
      title: 'Stellar Network',
    }),

    layout: 'default',

    data: (vm) => ({
      loading: true,
      peers: [],
      options: {
        edges: {
          smooth: false,
          selfReferenceSize: 10,
          color: {
            color: '#EEE',
            inherit: false,
          }
        },
        nodes: {
          shape: 'square',
          size: 10,
          borderWidth: 3,
        },
        groups: knownGroups,
      },
      nodeDialog: false,
      selectedNode: null,
      helpDialog: false,
      ledgersLoading: false,
      ledgers: [],
    }),

    computed: {
      networkData () {
        return {
          nodes: this.nodes,
          edges: this.edges,
        }
      },

      nodes () {
        return this.peers.map(node => {
          node.color = {
            border: '#BBB',
            background: '#DDD',
            highlight: {
              border: '#BBB',
              background: '#DDD',
            },
          }

          if (node.public_key in knownNodes) {
            Object.assign(node, knownNodes[node.public_key])
          } else {
            node.label = node.public_key.substring(0, 5)
          }

          node.color.border = node.color.highlight.border = this.ledgerStatus(node.ledger).style.split(' ')[1]

          return node
        })
      },

      edges () {
        let edges = []

        this.nodes.forEach(node => {
          if (node.ledger && node.ledger.quorum) {
            node.ledger.quorum.v.forEach(peer => {
              if (typeof peer === 'string') {
                let otherNode = this.findNodeByPublicKey(peer)

                if (otherNode) {
                  edges.push({
                    from: node.id,
                    to: otherNode.id
                  })
                }
              }
            })
          }
        })

        return edges
      },
    },

    methods: {
      findNodeByPublicKey (publicKey) {
        return this.nodes.find(node => node.public_key === publicKey)
      },

      selectNode(data) {
        this.selectedNode = this.peers.find(peer => peer.id === data.nodes[0])
        this.ledgersLoading = true
        this.ledgers = []

        axios.get('/api/peers/' + this.selectedNode.public_key)
          .then(response => {
            this.ledgers = response.data
          })
          .catch(() => {})
          .then(() => {
            this.ledgersLoading = false
          })

        setTimeout(() => {
          this.nodeDialog = true
        }, 1)
      },

      ledgerStatus (ledger) {
        let statuses = [
          {
            text: 'OK',
            style: 'color: #4caf50',
          },
          {
            text: 'WARN',
            style: 'color: #ff9800',
          },
          {
            text: 'PROBLEMS',
            style: 'color: #f44336',
          },
          {
            text: 'UNKNOWN',
            style: 'color: #BBB',
          }
        ]

        if (ledger === null) {
          return statuses[3]
        }

        if (ledger.fail_at) {
          let problematic = 0

          if (ledger.missing) {
            problematic += ledger.missing.length
          }

          if (ledger.disagree) {
            problematic += ledger.disagree.length
          }

          if (problematic === 0) {
            return statuses[0]
          } else if (problematic < ledger.fail_at) {
            return statuses[1]
          }
        }

        return statuses[2]
      },
    },

    mounted () {
      axios.get('/api/peers')
        .then(response => {
          this.peers = response.data

          this.loading = false

          this.$nextTick(() => {
            this.options.height = window.innerHeight + 'px'

            const network = new vis.Network(this.$refs.network, this.networkData, this.options)

            network.on('selectNode', this.selectNode)
          })
        })
    }
  }
</script>

<style lang="scss">
    .left-and-right {
        td:first-child {
            text-align: left !important;
        }

        td:last-child {
            text-align: right;
        }
    }

    td.dense {
        font-size: 10px;
        line-height: 14px;
        word-break: break-all;
    }
</style>