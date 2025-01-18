import type {Ref} from "vue";
import {onMounted, onUnmounted} from "vue";
import throttle from 'lodash.throttle'

export const useInfiniteScroll = (scrollContainer: Ref<HTMLElement | null>, cb: () => void) => {
    const handleInfiniteScroll = throttle(() => {
        if (!scrollContainer.value) return;
        let element = scrollContainer.value
        if (Math.floor(element.getBoundingClientRect().bottom) <= window.innerHeight) cb()
    }, 1000)

    onMounted(() => {
        window.addEventListener('scroll', handleInfiniteScroll)
    })

    onUnmounted(() => {
        window.removeEventListener('scroll', handleInfiniteScroll)
    })
}