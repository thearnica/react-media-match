import * as React from 'react';
import { create } from 'react-test-renderer';
import { createMediaMatcher } from '../src';

describe('Specs', () => {
  it('all false branches - defaults to last', () => {
    const SideMatch = createMediaMatcher({
      client: false,
      server: false,
    });

    const wrapper = create(<SideMatch.Matcher client="client" server="server" />);
    expect(wrapper.toJSON()).toEqual('server');
  });

  it('all true branches - defaults to first', () => {
    const SideMatch = createMediaMatcher({
      client: true,
      server: true,
    });

    const wrapper = create(<SideMatch.Matcher client="client" server="server" />);
    expect(wrapper.toJSON()).toEqual('client');
  });

  it('emulate ServerSideOnly component - pick last true', () => {
    const SideMatch = createMediaMatcher({
      client: false,
      server: true,
      random: false,
    });

    const wrapper = create(<SideMatch.Matcher client="client" server="server" random="random" />);
    expect(wrapper.toJSON()).toEqual('server');
  });

  it('emulate ClientSideOnly component - pick first true', () => {
    const SideMatch = createMediaMatcher({
      random: false,
      client: true,
      server: false,
    });

    const wrapper = create(<SideMatch.Matcher client="client" server="server" random="random" />);
    expect(wrapper.toJSON()).toEqual('client');
  });

  it('shall swap to client', () => {
    const SideMatch = createMediaMatcher({
      client: false,
      server: true,
    });

    const Component = () => {
      const [client, setClient] = React.useState(false);
      React.useEffect(() => {
        setClient(true);
      }, []);

      return (
        <SideMatch.Mock client={client} server={true}>
          <SideMatch.Matcher client="client" server="server" />
        </SideMatch.Mock>
      );
    };

    const wrapper = create(<Component />);
    expect(wrapper.toJSON()).toEqual('server');
    wrapper.update(<Component />);
    expect(wrapper.toJSON()).toEqual('client');
  });

  it('mock should bypass provider', () => {
    const Match = createMediaMatcher({
      a: false,
      b: false,
      c: false,
    });

    expect(create(<Match.Matcher a={1} b={2} c={3} />).toJSON()).toEqual('3');

    expect(
      create(
        <Match.Provider>
          <Match.Matcher a={1} b={2} c={3} />
        </Match.Provider>
      ).toJSON()
    ).toEqual('3');

    expect(
      create(
        <Match.Mock a={true}>
          <Match.Provider>
            <Match.Matcher a={1} b={2} c={3} />
          </Match.Provider>
        </Match.Mock>
      ).toJSON()
    ).toEqual('1');
  });
});
