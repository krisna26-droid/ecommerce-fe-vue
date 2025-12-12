<template>
  <button 
    :class="['base-button', `base-button--${variant}`, `base-button--${size}`, { 'base-button--block': block }]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    variant: {
      type: String,
      default: 'primary',
      validator: (value) => ['primary', 'secondary', 'outline', 'success', 'danger', 'link'].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value) => ['button', 'submit', 'reset'].includes(value)
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  user-select: none;
  border: 1px solid transparent;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
  font-family: inherit;
}

.base-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 107, 115, 0.25);
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Sizes */
.base-button--sm {
  padding: 6px 16px;
  font-size: 14px;
  border-radius: 4px;
}

.base-button--md {
  padding: 10px 24px;
  font-size: 16px;
  border-radius: 6px;
}

.base-button--lg {
  padding: 14px 32px;
  font-size: 18px;
  border-radius: 8px;
}

/* Variants */
.base-button--primary {
  background-color: #316b73;
  border-color: #316b73;
  color: white;
}

.base-button--primary:hover:not(:disabled) {
  background-color: #255560;
  border-color: #255560;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(49, 107, 115, 0.3);
}

.base-button--primary:active:not(:disabled) {
  transform: translateY(0);
}

.base-button--secondary {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

.base-button--secondary:hover:not(:disabled) {
  background-color: #5a6268;
  border-color: #545b62;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.base-button--outline {
  background-color: transparent;
  border-color: #316b73;
  color: #316b73;
}

.base-button--outline:hover:not(:disabled) {
  background-color: #316b73;
  color: white;
}

.base-button--success {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.base-button--success:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.base-button--danger {
  background-color: #dc3545;
  border-color: #dc3545;
  color: white;
}

.base-button--danger:hover:not(:disabled) {
  background-color: #c82333;
  border-color: #bd2130;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.base-button--link {
  background-color: transparent;
  border-color: transparent;
  color: #316b73;
  text-decoration: none;
}

.base-button--link:hover:not(:disabled) {
  color: #255560;
  text-decoration: underline;
}

/* Block */
.base-button--block {
  display: flex;
  width: 100%;
}
</style>