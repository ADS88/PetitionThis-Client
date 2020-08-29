<template>
  <div>
    <v-btn @click="removeSignature" color="error" v-if="signed">Remove Signature</v-btn>
    <v-btn @click="signPetition" color="primary" v-else>Sign petition</v-btn>
    <p id="error" v-if="error">{{errorMessage}}</p>
  </div>
</template>

<script>

  import api from "../api";

  export default {
    name: "PetitionActions",
    props: ["petitionId", "signed"],
    data() {
      return {
        error: false,
        parent: this.$parent
      }
    },
    methods: {
      signPetition() {
        api.signPetition(this.petitionId)
          .then((response) => {
              this.error = false;
              this.$parent.getSignatures()
            }
          )
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Error signing petition"
          })
      },
      removeSignature() {
        api.removeSignature(this.petitionId)
          .then((response) => {
              this.error = false;
              this.$parent.getSignatures()
            }
          )
          .catch((error) => {
            this.error = true;
            this.errorMessage = "Error removing signature"
          })
      }
    }
  }
</script>

<style scoped>
  #error {
    color: red;
    margin-left: 1rem;
  }
</style>
