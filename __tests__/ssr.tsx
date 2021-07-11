import * as React from 'react';
import { useState } from 'react';
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
  let mock: jest.SpyInstance;
  beforeEach(() => {
    mock = jest.spyOn(console, 'error');
  });

  afterEach(() => {
    mock.mockRestore();
  });

  it('bad case', () => {
    const MobileApp = () => (
      <MediaServerRender predicted="tablet">
        <MediaMatcher mobile="1mobile" tablet="2tablet" desktop="3" />
      </MediaServerRender>
    );

    const el = document.createElement('div');
    el.innerHTML = '1mobile';
    ReactDOM.hydrate(<MobileApp />, el);
    // tslint:disable-next-line:no-console
    expect(console.error).toHaveBeenCalled();
    expect(el.innerHTML).toBe('2tablet');
  });

  it('good case', async () => {
    const onPrediction = jest.fn();
    const MobileApp = () => (
      <MediaMock mobile={true}>
        <MediaServerRender predicted="tablet" onWrongPrediction={onPrediction}>
          <MediaMatcher mobile="1mobile" tablet="2tablet" desktop="3" />
        </MediaServerRender>
      </MediaMock>
    );

    const el = document.createElement('div');
    el.innerHTML = '2tablet';
    ReactDOM.hydrate(<MobileApp />, el);
    // tslint:disable-next-line:no-console
    expect(console.error).not.toHaveBeenCalled();
    expect(el.innerHTML).toBe('2tablet');
    // give react time to useEffect
    await new Promise((res) => setTimeout(res, 1));
    expect(el.innerHTML).toBe('1mobile');

    expect(onPrediction).toHaveBeenCalledWith('tablet', 'mobile');
  });

  it('delay-unlock case', async () => {
    let updateHydrated: any;
    const MobileApp = () => {
      const [isHydrated, setHydrated] = useState(false);
      updateHydrated = setHydrated;
      return (
        <MediaMock mobile={true}>
          <MediaServerRender predicted="tablet" hydrated={isHydrated}>
            <MediaMatcher mobile="1mobile" tablet="2tablet" desktop="3" />
          </MediaServerRender>
        </MediaMock>
      );
    };

    const el = document.createElement('div');
    el.innerHTML = '2tablet';
    ReactDOM.hydrate(<MobileApp />, el);
    expect(el.innerHTML).toBe('2tablet');
    // give react time to useEffect
    await new Promise((res) => setTimeout(res, 1));
    expect(el.innerHTML).toBe('2tablet');
    // update hydration state
    updateHydrated(true);
    // give react time to useEffect
    await new Promise((res) => setTimeout(res, 1));
    expect(el.innerHTML).toBe('1mobile');
  });
});
