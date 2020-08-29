<template>
    <div>
      <v-btn @click="editPetition" color="primary">Edit Petition</v-btn>
      <v-btn @click="deletePetition" color="error">Delete Petition</v-btn>
    </div>
</template>

<script>
    import api from "../api";
    import router from "../routes"

    export default {
        name: "PetitionOwnerActions",
        props: ["petitionId"],
        data() {
          return {
            currentUser: sessionStorage.getItem("userId")
          }
        },
      methods: {
          deletePetition(){
            api.deletePetition(this.petitionId)
            .then(response => router.push('/'))
            .catch(error => alert('Error deleting petition'))
          },
        editPetition(){
            router.push(`/EditPetition/${this.petitionId}`)
        }
      }
    }
</script>

<style scoped>

</style>
