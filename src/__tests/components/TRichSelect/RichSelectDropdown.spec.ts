import { NormalizedOptions } from '@variantjs/core';
import { shallowMount } from '@vue/test-utils';
import { computed } from 'vue';
import RichSelectDropdown from '../../../components/TRichSelect/RichSelectDropdown.vue';
import { TSelectOptions } from '../../../types';
import { getChildComponentNameByRef } from '../../testUtils';

describe('RichSelectDropdown', () => {
  const options: NormalizedOptions = [{
    value: 'a',
    text: 'a',
  }];

  const configuration: TSelectOptions = {
    hideSearchBox: false,
  };

  const showSearchInput = computed(() => true);

  it('renders the component', () => {
    const wrapper = shallowMount(RichSelectDropdown, {
      global: {
        provide: {
          configuration,
          options,
          showSearchInput,
        },
      },
    });

    expect(wrapper.vm.$el.tagName).toBe('DIV');
  });

  it('has a RichSelectOptionsList component', () => {
    const wrapper = shallowMount(RichSelectDropdown, {
      global: {
        provide: {
          configuration,
          showSearchInput,
          options,
        },
      },
    });

    expect(getChildComponentNameByRef(wrapper, 'optionsList')).toEqual('RichSelectOptionsList');
  });

  it('has a RichSelectSearchInput  component', () => {
    const wrapper = shallowMount(RichSelectDropdown, {
      global: {
        provide: {
          configuration,
          showSearchInput,
          options,
        },
      },
    });

    expect(getChildComponentNameByRef(wrapper, 'searchInput')).toEqual('RichSelectSearchInput');
  });

  it('hides the RichSelectSearchInput component if `hideSearchBox` is set', () => {
    const wrapper = shallowMount(RichSelectDropdown, {
      global: {
        provide: {
          options,
          showSearchInput,
          configuration: {
            ...options,
            hideSearchBox: true,
          },
        },
      },
    });

    expect(getChildComponentNameByRef(wrapper, 'searchInput')).toBeUndefined();
  });
});
