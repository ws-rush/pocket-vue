# Multi-step Form

This recipe demonstrates how to use pocket-vue to manage a multi-step form process.

## Example Code

```html
<div v-scope="{ 
  step: 1,
  formData: {
    name: '',
    email: '',
    address: '',
    city: ''
  },
  
  nextStep() { this.step++ },
  prevStep() { this.step-- },
  
  submit() {
    console.log('Submitting form:', this.formData)
    // Send data to server via fetch
  }
}">
  <div v-if="step === 1">
    <h3>Step 1: Personal Info</h3>
    <input v-model="formData.name" placeholder="Name">
    <input v-model="formData.email" placeholder="Email">
    <button @click="nextStep">Next</button>
  </div>

  <div v-else-if="step === 2">
    <h3>Step 2: Address Info</h3>
    <input v-model="formData.address" placeholder="Address">
    <input v-model="formData.city" placeholder="City">
    <button @click="prevStep">Back</button>
    <button @click="nextStep">Next</button>
  </div>

  <div v-else-if="step === 3">
    <h3>Step 3: Confirm</h3>
    <p>Name: {{ formData.name }}</p>
    <p>Email: {{ formData.email }}</p>
    <p>Address: {{ formData.address }}, {{ formData.city }}</p>
    <button @click="prevStep">Back</button>
    <button @click="submit">Confirm & Submit</button>
  </div>
</div>
```

---

## How it works

1.  **State Management**: We use a single `step` variable to track the current stage of the form and a `formData` object to store all user inputs.
2.  **Conditional Rendering**: We use `v-if`, `v-else-if`, and `v-else` to display only the relevant section of the form for the current step.
3.  **Step Navigation**: We provide `nextStep` and `prevStep` methods to increment or decrement the `step` variable.
4.  **Preserved State**: Because `formData` is defined in the root scope, all user inputs are preserved as they move between steps.
5.  **Summary View**: In the final step, we can easily display a summary of all entered data before submission.
