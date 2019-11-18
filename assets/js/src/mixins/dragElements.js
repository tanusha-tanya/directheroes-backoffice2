import draggable from 'vuedraggable'

export default {
  components: {
    draggable
  },

  methods: {
    replaceElements(event) {
      const { elements } = this;
      const { moved } = event;

      if (!moved) return;

      // console.log(moved);


      // const newIndex = elements.indexOf(elements[moved.newIndex]);
      // const oldIndex = elements.indexOf(elements[moved.oldIndex])

      // elements.splice(moved.oldIndex, 1)
      // elements.splice(moved.newIndex, 0, elements[moved.oldIndex])
    }
  }
}