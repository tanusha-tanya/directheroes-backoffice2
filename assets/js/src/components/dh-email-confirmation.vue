<template>
  <el-dialog
    :visible.sync="isShow"
    width="480px"
    append-to-body
    class="dh-email-confirmation"
    :modal="false"
    :show-close="true"
    :center="true"
    :close-on-click-modal="false"
    :destroy-on-close="true"
  >
    <span class="dh-email-confirmation__title">{{ currentStage.title }}</span>
    <img class="dh-email-confirmation__icon" :src="currentStage.icon" />
    <span class="dh-email-confirmation__heading">{{ currentStage.heading }}</span>
    <span class="dh-email-confirmation__description">{{ currentStage.description }}</span>
    <span
      class="dh-email-confirmation__footer"
      v-if="currentStage.footer"
    >If you haven't received the letter, we can resend it.</span>
    <div class="dh-email-confirmation__actions">
      <dh-button v-if="currentStage.id === 'confirmation'" type="outline" @click="onResend">resend</dh-button>
      <dh-button @click="isShow = false">got it</dh-button>
    </div>
  </el-dialog>
</template>

<script>
import dhLetterQuestion from "@/assets/letter-question.png";
import dhLetterLink from "@/assets/letter-link.png";
import axios from "axios";
import moment from "moment";

export default {
  data: () => {
    return {
      stages: [
        {
          id: "confirmation",
          title: "Confirm your email",
          icon: dhLetterQuestion,
          heading: "One last step!",
          description:
            "We need to make sure that you enter your email address so that you can continue to use some of the features of our platform.",
          footer: "If you haven't received the letter, we can resend it."
        },
        {
          id: "checking",
          title: "Check your email",
          icon: dhLetterLink,
          description:
            "Confirmation letter has been sent to specified email address. Please check your inbox and spam folders"
        }
      ],
      initialStage: "confirmation",
      dataChanged: false
    };
  },

  methods: {
    onResend() {
      axios.get(`/api/1.0.0/auth/email-confirmation/re-send/${dh.userName}`);

      this.initialStage = "checking";
    },

    todayIsViewed() {
      const { storageId } = this;

      const lastSeenTimestamp = localStorage.getItem(storageId);

      return lastSeenTimestamp && (Math.abs(moment().diff(moment.unix(lastSeenTimestamp), "days")) < 1);
    }
  },

  computed: {
    isShow: {
      get() {
        const { dhAccount } = this.$store.state;
        const { todayIsViewed, dataChanged } = this;

        return !dhAccount.isEmailConfirmed && !todayIsViewed();
      },

      set(value) {
        const { storageId, dataChanged } = this;

        localStorage.setItem(storageId, moment().unix());
        this.dataChanged = !dataChanged;
      }
    },

    currentStage() {
      return this.stages.find(stage => stage.id == this.initialStage);
    },

    storageId() {
      const { dhAccount } = this.$store.state;

      return `${dhAccount.id}_email-confirm-deny-timestamp`;
    }
  }
};
</script>

<style lang="scss">
$email-confirmation-bg-mask: 0.82;

.el-dialog__wrapper.dh-email-confirmation {
  background-color: unset;
  border-radius: 4px;

  &:before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: $white;
    opacity: $email-confirmation-bg-mask;
  }

  .el-dialog {
    top: 10%;
  }

  .el-dialog__body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: $white;
    padding-top: 0;
    padding-bottom: 33px;

    .dh-email-confirmation__title {
      font-size: 20px;
      line-height: 24px;
      color: $primaryDark;
      text-align: center;
    }

    .dh-email-confirmation__icon {
      margin-top: 40px;
      width: 120px;
      height: 89px;
    }

    .dh-email-confirmation__heading {
      font-size: 16px;
      line-height: 21px;
      margin-top: 28px;
      color: $primaryDark;
      text-align: center;
    }

    .dh-email-confirmation__description {
      font-size: 14px;
      line-height: 20px;
      color: $secondaryDark1;
      text-align: center;
      margin-top: 8px;
    }

    .dh-email-confirmation__footer {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: $secondaryDark1;
      margin-top: 20px;
    }

    .dh-email-confirmation__actions {
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>