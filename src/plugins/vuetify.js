import Vue from 'vue';
import Vuetify, {
    VSnackbar,
    VBtn,
    VIcon,
    VProgressCircular,
    VProgressLinear,
    VDivider,
    VContainer,
    VRow,
    VCol,
    VCard,
    VCardTitle,
    VSkeletonLoader,
    VForm,
    VTextField,
} from 'vuetify/lib';
import VuetifyToast from 'vuetify-toast-snackbar';

Vue.use(Vuetify, {
    components: {
        VSnackbar,
        VBtn,
        VIcon,
        VProgressCircular,
        VProgressLinear,
        VDivider,
        VContainer,
        VRow,
        VCol,
        VCard,
        VCardTitle,
        VSkeletonLoader,
        VForm,
        VTextField,
    },
});

let veutifyObj = new Vuetify({
    iconfont: 'fa',
    theme: {
        themes: {
            light: {
                primary: '#0A73B8',
                accent: '#57BE8E',
                gold: '#dea600',
                error: '#CE796B',
            },
        },
    },
});

Vue.use(VuetifyToast, {
    queueable: true,
    showClose: true,
    closeIcon: 'fa-times',
    property: '$flashMessage',
    $vuetify: veutifyObj.framework,
});

export default veutifyObj;
