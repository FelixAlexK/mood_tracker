<script setup lang="ts">
import { useForm } from "@tanstack/vue-form";

const form = useForm({
  defaultValues: {
    age: 0,
  },
  onSubmit: async ({ value }) => {
    // Do something with form data
    console.log(value);
  },
});
</script>

<template>
  <div>
    <form @submit.prevent.stop="form.handleSubmit">
      <div>
        <form.Field
          name="age"
          :validators="{
            onBlur: ({ value }) =>
              value < 13 ? 'You must be 13 to make an account' : undefined,
          }"
        >
          <template #default="{ field }">
            <label :for="field.name">Age:</label>
            <input
              :id="field.name"
              :name="field.name"
              :value="field.state.value"
              type="number"
              @input="(e) => field.handleChange((e.target as HTMLInputElement).valueAsNumber)
              "
            >
            <em v-if="field.state.meta.errors" role="alert">{{
              field.state.meta.errors.join(', ')
            }}</em>
          </template>
        </form.Field>
      </div>
      <button type="submit">
        Submit
      </button>
    </form>
  </div>
</template>
