import * as React from 'react';
import {mount} from 'enzyme';
import {MediaContext} from '../src/context';
import {MediaMatcher} from '../src';

describe('Specs', () => {
  const setup = () => {
    return {};
  };

  it('should render mobile', () => {
    // happy testing with enzyme!

    // const wrapper =
    //   mount(
    //     <MediaContext.Provider value={{mobile: true, tablet: true, desktop: true}}>
    //       <div >sdfsdf</div>
    //       {/*<MediaMatcher mobile="1" tablet="2" desktop="3"/>*/}
    //     </MediaContext.Provider>
    //   );
    expect(wrapper.text()).to.beEqual("1")
  });
});
