import { expandCollapse } from 'src/app/services/animations/expand-collapse';
import { fadeIn, fadeInBottom, fadeInLeft, fadeInRight, fadeInTop, fadeOut, fadeOutBottom, fadeOutLeft, fadeOutRight, fadeOutTop } from 'src/app/services/animations/fade';
import { shake } from 'src/app/services/animations/shake';
import { slideInBottom, slideInLeft, slideInRight, slideInTop, slideOutBottom, slideOutLeft, slideOutRight, slideOutTop } from 'src/app/services/animations/slide';
import { zoomIn, zoomOut } from 'src/app/services/animations/zoom';

export const kodAnimations = [
    expandCollapse,
    fadeIn, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight,
    fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight,
    shake,
    slideInTop, slideInBottom, slideInLeft, slideInRight,
    slideOutTop, slideOutBottom, slideOutLeft, slideOutRight,
    zoomIn, zoomOut
];
