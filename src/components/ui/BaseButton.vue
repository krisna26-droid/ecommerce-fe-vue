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
      validator: (value) => ['primary', 'secondary', 'outline', 'vans-black', 'link'].includes(value)
    },
    size: {
      type: String,
      default: 'md'
    },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' }
  }
}
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800; /* Tebal khas Vans */
  text-transform: uppercase; /* Gaya Off The Wall */
  letter-spacing: 1px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

/* Ukuran Kotak */
.base-button--sm { padding: 8px 16px; font-size: 12px; border-radius: 4px; }
.base-button--md { padding: 12px 24px; font-size: 14px; border-radius: 4px; }
.base-button--lg { padding: 16px 32px; font-size: 16px; border-radius: 4px; }

/* Warna Merah Vans (Menggantikan Hijau) */
.base-button--primary {
  background-color: #C41230; /* Vans Red */
  color: white;
}
.base-button--primary:hover:not(:disabled) {
  background-color: #a00e26;
  box-shadow: 0 4px 12px rgba(196, 18, 48, 0.3);
}

/* Warna Hitam Vans */
.base-button--vans-black {
  background-color: #000;
  color: white;
}
.base-button--vans-black:hover:not(:disabled) {
  background-color: #333;
}

.base-button--outline {
  background-color: transparent;
  border: 2px solid #000;
  color: #000;
}
.base-button--outline:hover:not(:disabled) {
  background-color: #000;
  color: #fff;
}

.base-button--block { width: 100%; display: flex; }
</style>