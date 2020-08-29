<template>
  <div>
    <v-expansion-panels id="searchbar" class="py-3">
      <v-expansion-panel>
        <v-expansion-panel-header>
          Show Signatures
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="signature in signatures" v-bind:key="signature.signatoryId">
            <Signature
              v-bind:signature="signature">
            </Signature>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script>
  import api from "../api";
  import Signature from "./Signature";

  export default {
    name: "Signatures",
    components: {Signature},
    props: ["signatures"],
    data() {
      return {
        petitionId: this.$route.params.id,
        signatures: []
      }
    },
  }
</script>

<style scoped>

</style>
