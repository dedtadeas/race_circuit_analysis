import { ref } from 'vue';

const toasts = ref([]);

export function useNotificationManager() {
    function addToast({ title = 'Notification', message = '', delay = null }) {
        const timestamp = new Date().toLocaleTimeString();
        const toast = { title, message, delay, timestamp };
        console.log('Adding toast:', toast);    
        toasts.value.push(toast);

        // Automatically remove the toast after the specified delay if provided
        if (delay !== null) {
            setTimeout(() => {
                removeToast(toast);
            }, delay);
        }
    }

    function removeToast(toast) {
        toasts.value = toasts.value.filter(t => t !== toast);
    }

    return {
        toasts,
        addToast,
        removeToast
    };
}
