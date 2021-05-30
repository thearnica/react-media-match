import * as React from 'react';
import ReactDOM = require('react-dom');
import { create } from 'react-test-renderer';
import { MediaMatcher, MediaMock, MediaServerRender } from '../src';

describe('SSR', () => {
  it('Render', () => {
    const wrapper = create(
      <MediaServerRender predicted="tablet">
        <MediaMatcher mobile="1" tablet="2" desktop="3" />
      </MediaServerRender>
    );
    expect(wrapper.toJSON()).toEqual('2');
  });

  it('Render:positive', () => {
    jest.spyOn(console, 'error');
    const wrapper = create(
      <MediaMock mobile={true}>
        <MediaServerRender predicted="tablet">
          <MediaMatcher mobile="1" tablet="2" desktop="3" />
        </MediaServerRender>
      </MediaMock>
    );
    expect(wrapper.toJSON()).toEqual('1');
  });

  it('Render:negative:before', () => {
    jest.spyOn(console, 'error');
    const wrapper = create(
      <MediaMock desktop={true}>
        <MediaServerRender predicted="tablet" hydrated={false}>
          <MediaMatcher mobile="1" tablet="2" desktop="3" />
        </MediaServerRender>
      </MediaMock>
    );
    expect(wrapper.toJSON()).toEqual('2');
  });

  it('Render:negative', () => {
    jest.spyOn(console, 'error');
    const wrapper = create(
      <MediaMock desktop={true}>
        <MediaServerRender predicted="tablet" hydrated={true}>
          <MediaMatcher mobile="1" tablet="2" desktop="3" />
        </MediaServerRender>
      </MediaMock>
    );
    expect(wrapper.toJSON()).toEqual('3');
  });
});

describe('hydrate', () => {
  beforeAll(() => {
    jest.spyOn(console, 'error');
  });

  it('bad case', () => {
    const MobileApp = () => (
      <MediaServerRender predicted="tablet">
        <MediaMatcher mobile="mobile" tablet="tablet" desktop="3" />
      </MediaServerRender>
    );

    const el = document.createElement('div');
    el.innerHTML = 'mobile';
    ReactDOM.hydrate(<MobileApp />, el);
    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalled();
    expect(el.innerHTML).toBe('tablet');
  });

  it('good case', async () => {
    const MobileApp = () => (
      <MediaMock mobile={true}>
        <MediaServerRender predicted="tablet">
          <MediaMatcher mobile="mobile" tablet="tablet" desktop="3" />
        </MediaServerRender>
      </MediaMock>
    );

    const el = document.createElement('div');
    el.innerHTML = 'tablet';
    ReactDOM.hydrate(<MobileApp />, el);
    // tslint:disable-next-line:no-console
    expect(console.error).not.toHaveBeenCalled();
    expect(el.innerHTML).toBe('tablet');
    // give react time to useEffect
    await new Promise((res) => setTimeout(res, 1));
    expect(el.innerHTML).toBe('mobile');
  });
});
