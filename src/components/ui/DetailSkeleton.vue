<template>
  <div class="detail-skeleton" aria-hidden="true">
    <div class="detail-skeleton__inner">
      <div class="detail-skeleton__copy">
        <span class="detail-skeleton__line detail-skeleton__line--short"></span>
        <span class="detail-skeleton__line detail-skeleton__line--title"></span>
        <span class="detail-skeleton__line"></span>
        <span class="detail-skeleton__line detail-skeleton__line--mid"></span>
      </div>
      <div class="detail-skeleton__media"></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-skeleton {
  background: $night;

  &__inner {
    @include container;
    @include flex(column-reverse, stretch, flex-start, 2rem);
    padding-block: 2.5rem 3rem;

    @include from('md') {
      flex-direction: row;
      align-items: center;
      gap: 4rem;
      padding-block: 4rem;
    }
  }

  &__copy {
    @include flex(column, flex-start, flex-start, 1rem);
    flex: 1;
  }

  &__line,
  &__media {
    background: rgba($on-dark, 0.08);
    animation: detail-pulse 1.6s ease-in-out infinite;
  }

  &__line {
    width: 90%;
    height: 0.9rem;

    &--short {
      width: 30%;
    }

    &--mid {
      width: 60%;
    }

    &--title {
      width: 75%;
      height: 3rem;
    }
  }

  &__media {
    aspect-ratio: 4 / 5;

    @include from('md') {
      flex: 0 0 40%;
    }
  }
}

@keyframes detail-pulse {
  50% {
    opacity: 0.45;
  }
}
</style>
