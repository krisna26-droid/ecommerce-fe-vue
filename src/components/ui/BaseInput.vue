<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="id" class="base-input-label">
      {{ label }}
      <span v-if="required" class="base-input-required">*</span>
    </label>
    
    <div class="base-input-container">
      <span v-if="$slots.prepend" class="base-input-prepend">
        <slot name="prepend"></slot>
      </span>
      
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="[
          'base-input',
          `base-input--${size}`,
          { 'base-input--error': error },
          { 'base-input--disabled': disabled },
          { 'base-input--prepend': $slots.prepend },
          { 'base-input--append': $slots.append }
        ]"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="$emit('focus', $event)"
        @blur="$emit('blur', $event)"
      />
      
      <span v-if="$slots.append" class="base-input-append">
        <slot name="append"></slot>
      </span>
    </div>
    
    <span v-if="error" class="base-input-error-message">{{ error }}</span>
    <span v-else-if="hint" class="base-input-hint">{{ hint }}</span>
  </div>
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    id: { type: String, default: () => `input-${Math.random().toString(36).substr(2, 9)}` },
    modelValue: { type: [String, Number], default: '' },
    type: { type: String, default: 'text' },
    label: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    size: { type: String, default: 'md' },
    error: { type: String, default: '' },
    hint: { type: String, default: '' },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  },
  emits: ['update:modelValue', 'focus', 'blur']
}
</script>

<style scoped>
.base-input-wrapper { display: flex; flex-direction: column; width: 100%; }

.base-input-label { 
  display: block; 
  margin-bottom: 6px; 
  font-size: 13px; 
  font-weight: 800; /* Extra Bold khas Vans */
  text-transform: uppercase; /* Gaya tipografi brand */
  color: #000; 
}

.base-input-required { 
  color: #C41230; /* Merah Vans menggantikan merah standar */
  margin-left: 2px; 
}

.base-input-container { position: relative; display: flex; align-items: center; }

.base-input {
  width: 100%;
  font-family: inherit;
  border: 1px solid #d1d5db;
  border-radius: 4px; /* Sudut lebih tajam/boxy */
  transition: all 0.2s ease;
  background-color: white;
  color: #000;
}

/* State Focus: Menggunakan Vans Red (#C41230) */
.base-input:focus { 
  outline: none; 
  border-color: #C41230; 
  box-shadow: 0 0 0 3px rgba(196, 18, 48, 0.1); 
}

.base-input::placeholder { color: #9ca3af; text-transform: none; font-weight: 400; }
.base-input:disabled { background-color: #f3f4f6; cursor: not-allowed; opacity: 0.6; }

/* Sizes disesuaikan agar lebih proporsional */
.base-input--sm { padding: 8px 12px; font-size: 13px; }
.base-input--md { padding: 12px 16px; font-size: 14px; }
.base-input--lg { padding: 16px 20px; font-size: 16px; }

/* Slot Styling */
.base-input-prepend, .base-input-append {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  z-index: 2;
}

.base-input-prepend { left: 12px; }
.base-input-append { right: 12px; }

.base-input--prepend { padding-left: 40px; }
.base-input--append { padding-right: 45px; }

.base-input-error-message { 
  display: block; 
  margin-top: 6px; 
  font-size: 12px; 
  color: #C41230; /* Warna Merah Vans */
  font-weight: 600;
}

.base-input-hint { display: block; margin-top: 6px; font-size: 12px; color: #6b7280; }
</style>