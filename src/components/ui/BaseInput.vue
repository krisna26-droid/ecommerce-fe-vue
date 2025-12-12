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
    id: {
      type: String,
      default: () => `input-${Math.random().toString(36).substr(2, 9)}`
    },
    modelValue: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'text',
      validator: (value) => ['text', 'email', 'password', 'number', 'tel', 'url', 'search'].includes(value)
    },
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    error: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'focus', 'blur']
}
</script>

<style scoped>
.base-input-wrapper {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.base-input-label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.base-input-required {
  color: #dc3545;
  margin-left: 2px;
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  font-family: inherit;
  font-size: 16px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: all 0.2s ease;
  background-color: white;
}

.base-input:focus {
  outline: none;
  border-color: #316b73;
  box-shadow: 0 0 0 3px rgba(49, 107, 115, 0.1);
}

.base-input::placeholder {
  color: #9ca3af;
}

.base-input:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.6;
}

/* Sizes */
.base-input--sm {
  padding: 6px 12px;
  font-size: 14px;
}

.base-input--md {
  padding: 10px 16px;
  font-size: 16px;
}

.base-input--lg {
  padding: 14px 20px;
  font-size: 18px;
}

/* Error state */
.base-input--error {
  border-color: #dc3545;
}

.base-input--error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
}

/* Prepend/Append */
.base-input--prepend {
  padding-left: 40px;
}

.base-input--append {
  padding-right: 40px;
}

.base-input-prepend,
.base-input-append {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  pointer-events: none;
}

.base-input-prepend {
  left: 12px;
}

.base-input-append {
  right: 12px;
}

/* Messages */
.base-input-error-message {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #dc3545;
}

.base-input-hint {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}
</style>