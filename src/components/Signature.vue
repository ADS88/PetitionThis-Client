<template>
  <v-list-item id="item">
    <v-avatar id="user-image">
      <v-img
        v-bind:src="imageUrl"
        lazy-src="https://ramcotubular.com/wp-content/uploads/default-avatar.jpg"
        v-bind:alt="signature.name"
        @error="onImgError()"
      ></v-img>
    </v-avatar>
    <p>{{signature.name}}{{location}}</p>
  </v-list-item>
</template>


<script>
  import api from "../api";

  export default {
    name: "Signature",
    props: ["signature"],
    data() {
      return {
        rootUrl: api.SERVER_URL,
        hasError: false
      }
    },
    computed: {
      imageUrl: function () {
        return `${this.rootUrl}/users/${this.signature.signatoryId}/photo`
      },
      location: function () {
        let location = "";
        if (this.signature.city) {
          location += ", " + this.signature.city
        }
        if (this.signature.country) {
          location +=  ", " + this.signature.country
        }
        return location
      }
    },
  }
</script>

<style scoped>
  #user-image {
    margin-right: 1rem;
  }

  #item {
    margin-left: -1rem;
    margin-bottom: 1rem;
  }
</style>
