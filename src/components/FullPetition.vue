<template>
  <div>
    <v-card
      class="mx-auto"
      max-width="800"
    >
      <v-img
        max-height="400"
        class="white--text align-end"
        v-bind:src="imageUrl"
      >
      </v-img>

      <div class="social">
        <v-card-title>
          {{petition.title}}
        </v-card-title>

        <a
          title="Share on Reddit" target="_blank" :href="redditUrl">
          <i class="fab fa-reddit fa-2x"></i>
        </a>


        <a title="Share on Twitter" :href="twitterUrl" target="_blank">
          <i class="fab fa-twitter fa-2x"></i>
        </a>

        <a
          title="Share by Email" target="_blank" :href="'mailto:' + emailUrl">
          <i class="fas fa-envelope fa-2x"></i>
        </a>

      </div>


      <v-card-text class="text--primary">
        <div>
        <v-avatar size="72">
          <v-img
            max-height="150"
            max-width="150"
            class="white--text align-end"
            :src="authorImageUrl"
            lazy-src="https://ramcotubular.com/wp-content/uploads/default-avatar.jpg"
          >
          </v-img>
        </v-avatar>
        </div>
        <br>
        <div><strong>Description:</strong> {{petition.description}}</div>
        <br>
        <div><strong>Signatures:</strong> {{this.signatures.length}}</div>
        <div><strong>Author:</strong>  {{petition.authorName}}</div>
        <div v-if="petition.authorCountry"><strong>Country:</strong>  {{petition.authorCountry}}</div>
        <div v-if="petition.authorCity"><strong>City: </strong> {{petition.authorCity}}</div>
        <div><strong>Category:</strong>  {{petition.category}}</div>
        <div><strong>Created date:</strong>  {{createdDate}}</div>
        <div><strong>Closing date:</strong>  {{closingDate}}</div>
        <Signatures v-bind:signatures="signatures"></Signatures>
      </v-card-text>
    </v-card>
    <div class ="text-xl-center" align="center" id="actions" v-if="userId !== null">
      <PetitionOwnerActions v-if="petition.authorId == userId" v-bind:petitionId="petitionId"></PetitionOwnerActions>
      <PetitionActions v-bind:petitionId="petitionId" v-bind:signed="hasSignedPetition" v-else></PetitionActions>
    </div>
  </div>
</template>

<script>
  import api from "../api";
  import Signatures from "./Signatures";
  import PetitionOwnerActions from "./PetitionOwnerActions";
  import PetitionActions from "./PetitionActions";
  import awsRootUrl from "../awsRootUrl";

  export default {
    name: "FullPetition",
    components: {PetitionActions, Signatures, PetitionOwnerActions},
    data() {
      return {
        petition: {},
        rootUrl: api.SERVER_URL,
        googlePlusUrl: "https://plus.google.com/share?url=www.google.com",
        petitionId: this.$route.params.id,
        emailUrl: "?body=Check out this Petition " + window.location.href,
        twitterUrl: "https://twitter.com/share?ref_src=twsrc%5Etfw?",
        redditUrl: " http://www.reddit.com/submit?url=Check out this petition! " + window.location.href,
        userId: sessionStorage.getItem("userId"),
        signatures: [],
      }
    },
    computed: {
      imageUrl: function () {
        return `${awsRootUrl}/petition${this.petition.petitionId}.jpg`
      },
      authorImageUrl: function() {
        return `${awsRootUrl}/user${this.petition.authorId}.jpg`
      },
      hasSignedPetition: function () {
        let hasSigned = false;
        for (let i = 0; i < this.signatures.length; i++) {
          let singatureObject = this.signatures[i]
          if (singatureObject.signatoryId == this.userId) {
            hasSigned = true;
          }
        }
        return hasSigned
      },
      createdDate: function() {
        return new Date(this.petition.createdDate).toUTCString()
      },
      closingDate: function () {
        if (this.petition.closingDate) {
          return new Date(this.petition.closingDate).toUTCString()
        } else {
          return "No closing date specified"
        }
      },
    },
    methods: {
      getPetition() {
        api.getDetailedPetiton(this.petitionId)
          .then(response => this.petition = response.data)
      },
      getSignatures() {
        console.log("updating signatures")
        api.getPetitionSignatures(this.petitionId)
          .then(response => this.signatures = response.data)
      },
    },
    mounted() {
      this.getPetition()
      this.getSignatures()
    }
  }
</script>

<style scoped>
  i {
    margin-left: 1rem;
  }
  #actions{
    margin: 2rem 0;
  }
</style>
