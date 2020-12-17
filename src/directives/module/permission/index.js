import store from "@/store";
export default {
  name: "permission",
  value: {
    inserted: function(el, { value }) {
      setTimeout(() => {
        if (!store.state.permissions.includes(value)) {
          el.style.display = "none";
        }
      });
    }
  }
};
