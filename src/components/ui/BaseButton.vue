<template>
  <button
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--block': block },
    ]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "BaseButton",
  props: {
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        ["primary", "secondary", "outline", "vans-black", "link"].includes(
          value
        ),
    },
    size: {
      type: String,
      default: "md",
    },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: "button" },
  },
};
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid transparent;
}

/* UKURAN */
.base-button--sm {
  padding: 8px 16px;
  font-size: 12px;
  border-radius: 4px;
}
.base-button--md {
  padding: 12px 24px;
  font-size: 14px;
  border-radius: 4px;
}
.base-button--lg {
  padding: 16px 32px;
  font-size: 16px;
  border-radius: 4px;
}

/* VARIAN MERAH VANS */
.base-button--primary {
  background-color: var(--vans-red);
  color: var(--vans-white);
}
.base-button--primary:hover:not(:disabled) {
  background-color: var(--vans-black);
  transform: translateY(-2px);
}

/* VARIAN HITAM VANS */
.base-button--vans-black {
  background-color: var(--vans-black);
  color: var(--vans-white);
}
.base-button--vans-black:hover:not(:disabled) {
  background-color: #333;
}

/* VARIAN OUTLINE INDUSTRIAL */
.base-button--outline {
  background-color: transparent;
  border: 2px solid var(--vans-black);
  color: var(--vans-black);
}
.base-button--outline:hover:not(:disabled) {
  background-color: var(--vans-black);
  color: var(--vans-white);
}

.base-button--block {
  width: 100%;
  display: flex;
}

.base-button:disabled {
  background-color: var(--vans-gray-border);
  color: #999;
  cursor: not-allowed;
  border-color: var(--vans-gray-border);
}
</style>
