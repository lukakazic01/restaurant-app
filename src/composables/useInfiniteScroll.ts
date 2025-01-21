import type {Ref} from "vue";
import {onMounted, onUnmounted} from "vue";
import throttle from 'lodash.throttle'

// This is naively implemented, listener should be on container, and we should make container scrollable,
// But since the user experience isn't so good, I decided to leave it like this, but it should be improved
export const useInfiniteScroll = (scrollContainer: Ref<HTMLElement | null>, cb: () => void) => {
    const handleInfiniteScroll = throttle(() => {
        if (!scrollContainer.value) return;
        const element = scrollContainer.value
        if (Math.floor(element.getBoundingClientRect().bottom) <= window.innerHeight) cb()
    }, 150)

    onMounted(() => {
        window.addEventListener('scroll', handleInfiniteScroll)
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', handleInfiniteScroll)
    })
}