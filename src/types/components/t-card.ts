import { WithVariantPropsAndClassesList, TCardConfigKeys } from '@variantjs/core';
import { HTMLAttributes } from 'vue';
import { Data } from '../misc';

export type TCardOptions = WithVariantPropsAndClassesList<{
  tagName?: string
  body?: string
  header?: string
  footer?: string
}, TCardConfigKeys> & HTMLAttributes & Data;
