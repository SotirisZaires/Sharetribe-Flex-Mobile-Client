import React from 'react';
import {
  View,
  Image,
  ImageBackground,
  ScrollView,
} from 'react-native';
import T from 'prop-types';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { Tab, TabView } from 'react-native-easy-tabs';

import s from './styles';
import i18n from '../../i18n';
import { width, height } from '../../styles/dimensions';
import {
  NavigationButton,
  Rating,
  Text,
  Touchable,
  TabHeader,
} from '../../components';
import Label from './components/Label/Label';
import Location from './components/Location/Location';
import Seller from './components/Seller/Seller';
import DescriptionTab from './components/DescriptionTab/DescriptionTabContainer';

const placeholderImage = require('../../assets/png/Group.png');

const ProductScreen = ({
  onChangeIndex,
  currentIndex,
  product,
  images,
  image,
  labels,
  user,
  onChangeTabIndex,
  tabIndex,
}) => (
  <ScrollView style={s.container}>
    <View style={s.carouselContainer}>
      <Carousel
        data={images}
        layout="default"
        renderItem={({ item }) => (
          <View style={s.slide}>
            <ImageBackground
              source={placeholderImage}
              style={s.carouselBackgroundImage}
            >
              <Image source={{ uri: item }} style={s.image} />
            </ImageBackground>
          </View>
        )}
        sliderWidth={width}
        sliderHeight={325}
        itemWidth={width}
        onSnapToItem={(index) => onChangeIndex(index)}
      />
      <Pagination
        activeDotIndex={currentIndex}
        dotsLength={images.length}
        containerStyle={s.paginationContainerStyle}
        dotStyle={s.dotStyle}
      />
    </View>
    <View style={s.headerContainer}>
      <View style={s.priceContainer}>
        <Text xlargeSize bold>
          ${product.price.amount}
        </Text>
        <Text xmediumSize gray>
          /{i18n.t('home.day')}
        </Text>
      </View>
      <View style={s.availabilityContainer}>
        <Text mediumSize red>
          lease
        </Text>
      </View>
    </View>
    <View style={s.titleTextContainer}>
      <Text largeSize bold black>
        {product.title}
      </Text>
    </View>
    <View style={s.rating}>
      <Rating value={4} />
    </View>
    <Label.Row style={s.labelContainer}>
      <Label text={product.publicData.brand} title="Brand" />
      <Label
        text={product.publicData.subCategory}
        title="Subcategory"
      />
      <Label text={product.publicData.category} title="Category" />
    </Label.Row>
    <View style={s.containerTabView}>
      <TabHeader
        currentTabIndex={tabIndex}
        onChangeTabIndex={onChangeTabIndex}
      />

      <TabView selectedTabIndex={tabIndex}>
        <Tab>
          <View style={s.tab1}>
            <DescriptionTab text={product.description} />
          </View>
        </Tab>
        <Tab lazy>
          <View style={s.tab2}>
            <Text style={s.paragraph}>Second tab</Text>
          </View>
        </Tab>
      </TabView>
    </View>
    {/* <Location />
    <Seller image={image} name="Ben" rating={4} /> */}
  </ScrollView>
);

ProductScreen.navigationOptions = () => ({
  headerTransparent: true,
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerRight: (
    <NavigationButton
      name="outline-edit-24px"
      color="white"
      right
      // onPress={}
      circled
    />
  ),
  headerLeft: <NavigationButton goBack color="white" circled />,
});

ProductScreen.propTypes = {
  onChangeIndex: T.func,
  currentIndex: T.number,
};
export default ProductScreen;
