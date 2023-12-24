import { FunctionComponent, PropsWithChildren } from 'react';
import { OptionType, SingleOptionItemProps } from '../../constants/config';
import SingleFullSettingsLayout from '../../Settings/components/Layout/SingleFullSettingsLayout';

interface RightOptionDetailProps extends PropsWithChildren {
  value: OptionType;
  optionList: Array<SingleOptionItemProps>;
}

const RightOptionDetail: FunctionComponent<RightOptionDetailProps> = ({
  optionList,
  value,
  children,
}) => {
  return (
    <div className="w-full font-['Microsoft Yahei']">
      {optionList
        .filter((item) => item.value === value)
        .map(({ rightComponent: RightComponent, title }, index) => (
          <SingleFullSettingsLayout title={title} key={index}>
            <RightComponent />
          </SingleFullSettingsLayout>
        ))}
    </div>
  );
};

export default RightOptionDetail;
