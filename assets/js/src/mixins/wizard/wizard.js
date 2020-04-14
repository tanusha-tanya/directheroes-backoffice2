import Vue from 'vue'

export default {
  data() {
    return {
      title: '',
      width: '50%',
      wizardState: null,
      parentWizard: true
    }
  },

  props: ['value'],

  computed: {
    isShow: {
      get() {
        return this.value
      },

      set(value) {
        this.$emit('input', value)
      }
    },
  },

  methods: {
    setWizardState(title, wizardState, data = {}) {
      this.title = title;
      this.wizardState = wizardState;

      console.log(data);


      Object.keys(data).forEach(dataProperty => {
        const dataValue = data[dataProperty];

        if (this.hasOwnProperty(dataProperty)) {
          this[dataProperty] = dataValue;
        } else {
          Vue.set(this, dataProperty, dataValue)
        }
      })
    },

    closeWizard() {
      this.isShow = false;
    }
  }
}