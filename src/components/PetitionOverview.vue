<template>
  <v-card
    @click="openDetailedPetition"
    id="petition"
    class="mx-auto"
    max-width="800"
  >
    <v-img
      max-height="400"
      class="white--text align-end"
      v-bind:src="imageUrl"
    >
    </v-img>

    <v-card-title>{{petition.title}}</v-card-title>

    <v-card-text class="text--primary">
      <div><strong>Signatures:</strong> {{petition.signatureCount}}</div>
      <div><strong>Author:</strong> {{petition.authorName}}</div>
      <div><strong>Category:</strong> {{petition.category}}</div>
    </v-card-text>
  </v-card>

</template>

<script>
  import api from "../api";
  import awsRootUrl from "../awsRootUrl";

  export default {
    name: "PetitionOverview",
    props: ["petition"],
    computed: {
      imageUrl: function () {
        return `${awsRootUrl}/petition${this.petition.petitionId}.jpg`
      }
    },
    data() {
      return {
        petitionImage: null,
        rootUrl: api.SERVER_URL
      }
    },
    methods: {
      getPetitionImage() {
        api.getPetitionImage(this.petition.petitionId)
          .then(response => this.petitionImage = response.data)
      }
    },
  }
</script>

<style>
  #petition {
    cursor: pointer;
  }
</style>
