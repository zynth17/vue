/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  mount, VueWrapper,
} from '@vue/test-utils';
import TDropdown from '@/components/TDropdown.vue';
import { TDropdownConfig } from '@variantjs/core';

const dropdownIsReady: (wrapper: VueWrapper<any>) => Promise<void> = (wrapper: VueWrapper<any>) => new Promise((resolve) => {
  // 1. Until component is mounted
  wrapper.vm.$nextTick().then(() => {
    // 2. Popper is adjusted
    wrapper.vm.$nextTick().then(() => {
      // 4. dom update for running popper
      wrapper.vm.$nextTick().then(() => {
        // 4. dom update after popperIsAdjusted is set to `true`
        wrapper.vm.$nextTick().then(() => resolve());
      });
    });
  });
});

describe('TDropdown.vue', () => {
  it('renders the component', () => {
    const wrapper = mount(TDropdown);

    expect(wrapper.find('button').exists()).toBe(true);
    expect(wrapper.find('button').isVisible()).toBe(true);
    expect(wrapper.find('div').exists()).toBe(true);
    expect(wrapper.find('div').element.style.visibility).toBe('hidden');
    expect(wrapper.vm.$refs.trigger).toBeTruthy();
    expect(wrapper.vm.$refs.dropdown).toBeTruthy();
  });

  it('has default classes', () => {
    const wrapper = mount(TDropdown);
    const { trigger, dropdown } = wrapper.vm.$refs;

    expect(trigger.className).toBe(TDropdownConfig.classes.trigger);
    expect(dropdown.className).toBe(TDropdownConfig.classes.dropdown);
    expect(wrapper.vm.configuration.classesList).toEqual(TDropdownConfig.classes);
  });

  it('initializes the  dropdown', async () => {
    const wrapper = mount(TDropdown);

    const { dropdown } = wrapper.vm.$refs;

    expect(wrapper.vm.shown).toBe(false);
    expect(wrapper.vm.popperIsAdjusted).toBe(false);
    expect(dropdown.style.visibility).toBe('hidden');

    await dropdownIsReady(wrapper);

    expect(wrapper.vm.popperIsAdjusted).toBe(true);
    expect(wrapper.vm.shown).toBe(false);
  });

  it('uses the content of the trigger slot inside the trigger button', () => {
    const wrapper = mount(TDropdown, {
      slots: {
        trigger: 'Press me!',
      },
    });
    expect(wrapper.find('button').text()).toBe('Press me!');
  });

  it('uses the content of the text prop inside the trigger button', () => {
    const wrapper = mount(TDropdown, {
      props: {
        text: 'Press me!',
      },
    });

    expect(wrapper.find('button').text()).toBe('Press me!');
  });

  it('prioritizes the slot over the text prop', () => {
    const wrapper = mount(TDropdown, {
      props: {
        text: 'Press me2!',
      },
      slots: {
        trigger: 'Press me!',
      },
    });

    expect(wrapper.find('button').text()).toBe('Press me!');
  });

  it('uses the content of the default slot inside the dropdown', () => {
    const wrapper = mount(TDropdown, {
      slots: {
        default: 'Dropdown stuffy',
      },
    });

    const { dropdown } = wrapper.vm.$refs;
    expect(dropdown.innerHTML).toBe('Dropdown stuffy');
  });

  it('shows the dropdown when the trigger is pressed', async () => {
    const wrapper = mount(TDropdown);

    const trigger = wrapper.get('button');
    const { dropdown } = wrapper.vm.$refs;

    await dropdownIsReady(wrapper);

    expect(dropdown.style.display).toBe('none');

    await trigger.trigger('click');

    expect(wrapper.vm.shown).toBe(true);

    expect(dropdown.style.display).toBe('');
  });

  it('doesnt teleports the dropdown by default', () => {
    const wrapper = mount(TDropdown);

    expect(wrapper.find('div').exists()).toBe(true);
  });

  it('teleports the dropdown to the body if teleport option is set', () => {
    mount(TDropdown, {
      props: {
        teleport: true,
      },
      slots: {
        default: 'The body',
      },
    });

    expect(document.body.children[0].textContent).toBe('The body');
  });

  it('teleports the dropdown to the selector in the teleportTo prop', () => {
    const div = document.createElement('div');
    div.id = 'teleport-here';

    document.body.appendChild(div);

    mount(TDropdown, {
      props: {
        teleport: true,
        teleportTo: '#teleport-here',
      },
      slots: {
        default: 'The body',
      },
    });

    expect(document.querySelector('#teleport-here')!.textContent).toBe('The body');
  });

  it('teleports the dropdown to the element in the teleportTo prop', () => {
    const div = document.createElement('div');
    div.id = 'dont-teleport-here';

    document.body.appendChild(div);

    mount(TDropdown, {
      props: {
        teleport: true,
        teleportTo: div,
      },
      slots: {
        default: 'The body',
      },
    });

    expect(document.querySelector('#teleport-here')!.textContent).toBe('The body');
  });

  it('the trigger is a button with type `button`', async () => {
    const wrapper = mount(TDropdown);

    const trigger = wrapper.get('button');

    expect(trigger.attributes().type).toBe('button');
    expect(trigger.element.tagName).toBe('BUTTON');
  });

  it('disables the dropdown', async () => {
    const wrapper = mount(TDropdown, {
      props: {
        disabled: true,
      },
    });

    const trigger = wrapper.get('button');
    const { dropdown } = wrapper.vm.$refs;

    await dropdownIsReady(wrapper);

    expect(trigger.attributes().disabled).toBeDefined();

    await trigger.trigger('click');

    expect(wrapper.vm.shown).toBe(false);

    expect(dropdown.style.display).toBe('none');
  });

  it('applies the attributes to the trigger button', () => {
    const wrapper = mount(TDropdown, {
      attrs: {
        id: 'my-id',
        'data-foo': 'bar',
      },
    });

    const trigger = wrapper.get('button');

    expect(trigger.attributes().id).toBe('my-id');
    expect(trigger.attributes()['data-foo']).toBe('bar');
  });

  it('applies the attributes that comes from the configuration the trigger button', () => {
    const wrapper = mount(TDropdown, {
      global: {
        provide: {
          configuration: {
            TDropdown: {
              id: 'my-id',
              'data-foo': 'bar',
            },
          },
        },
      },
    });

    const trigger = wrapper.get('button');

    expect(trigger.attributes().id).toBe('my-id');
    expect(trigger.attributes()['data-foo']).toBe('bar');
  });

  it('prioritizes the local attributes', () => {
    const wrapper = mount(TDropdown, {
      global: {
        provide: {
          configuration: {
            TDropdown: {
              id: 'my-id',
            },
          },
        },
      },
      attrs: {
        id: 'my-local-id',
      },
    });

    const trigger = wrapper.get('button');

    expect(trigger.attributes().id).toBe('my-local-id');
  });
});
