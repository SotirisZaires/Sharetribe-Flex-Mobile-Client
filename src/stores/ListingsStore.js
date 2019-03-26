/* eslint-disable no-shadow */
import { types as t, getEnv } from 'mobx-state-tree';
import createFlow from './helpers/createFlow';
import { AlertService, NavigationService } from '../services';
import i18n from '../i18n';
import processJsonApi, {
  processJsonApiIncluded,
} from './utils/processJsonApi';
import listModel from './utils/listModel';

const ProductPublicData = t.model('ProductPublicData', {
  brand: t.maybe(t.string),
  category: t.maybe(t.string),
  level: t.maybe(t.string),
  location: t.maybe(t.string),
  subCategory: t.maybe(t.string),
});

const Price = t.model('Price', {
  amount: t.number,
  currency: t.string,
});

const ImageData = t.model('ImageData', {
  height: t.number,
  name: t.string,
  url: t.string,
  width: t.number,
});

const ImageVariants = t.model('ImageVariants', {
  default: t.maybe(ImageData),
});

export const Image = t.model('Image', {
  id: t.identifier,
  variants: t.maybe(ImageVariants),
});

const ImageList = listModel('ProductImageList', {
  of: t.reference(Image),
  entityName: 'images',
  identifierName: 'id',
  responseTransformer: responseTransformerIncluded,
});

function responseTransformerIncluded(res) {
  return res.map(processJsonApiIncluded);
}

const ProductRelationships = t
  .model('ProductRelationships', {
    images: t.maybe(t.array(t.reference(Image))),
  })
  .views((store) => ({
    get getImages() {
      return store.images.slice();
    },
  }));

export const Product = t.model('Product', {
  id: t.identifier,
  description: t.string,
  deleted: t.boolean,
  geolocation: t.null,
  createdAt: t.maybe(t.Date),
  state: t.string,
  title: t.string,
  publicData: t.optional(t.maybeNull(ProductPublicData), null),
  price: t.optional(t.maybeNull(Price), null),
  metadata: t.model('metadata', {}),
  relationships: t.maybe(ProductRelationships),
});

const ProductList = listModel('ProductList', {
  of: t.reference(Product),
  entityName: 'listings',
  identifierName: 'id',
  responseTransformer,
});

const SearchProductList = listModel('SearchProductList', {
  of: t.reference(Product),
  entityName: 'listings',
  identifierName: 'id',
  responseTransformer,
});

const OwnProductList = listModel('OwnProductList', {
  of: t.reference(Product),
  entityName: 'listings',
  identifierName: 'id',
  responseTransformer,
});

function responseTransformer(res) {
  return res.map(processJsonApi);
}

const ListingsStore = t
  .model('ListingsStore', {
    list: ProductList,
    imageList: ImageList,
    searchList: SearchProductList,
    ownList: OwnProductList,
    createListing: createFlow(createListing),
    fetchListings: createFlow(fetchListings),
    searchListings: createFlow(searchListings),
    fetchOwnListings: createFlow(fetchOwnListings),
  })
  .views((store) => ({
    get Api() {
      return getEnv(store).Api;
    },
  }));

function createListing(flow, store) {
  return function* createListing({
    images,
    title,
    category,
    subCategory,
    brand,
    level,
    description,
    price,
    location,
  }) {
    try {
      flow.start();
      const res = yield Promise.all(
        images.map((image) => store.Api.imagesUpload(image)),
      );

      const imagesId = res.map((item) => item.data.data.id.uuid);

      yield store.Api.createListing({
        title,
        category,
        subCategory,
        brand,
        level,
        description,
        price,
        location,
        images: imagesId,
      });

      flow.success();

      // TODO: move this alert into screen container
      AlertService.showAlert(
        i18n.t('alerts.createListingSuccess.title'),
        i18n.t('alerts.createListingSuccess.message'),
        [
          {
            text: i18n.t('common.ok'),
            onPress: () => NavigationService.navigateToHome(),
          },
          {
            text: i18n.t('common.cancel'),
            style: 'cancel',
          },
        ],
      );
    } catch (err) {
      flow.failed(err);

      // TODO: move this alert into screen container
      AlertService.showAlert(
        i18n.t('alerts.createListingError.title'),
        i18n.t('alerts.createListingError.message'),
      );
    }
  };
}

function fetchListings(flow, store) {
  return function* fetchListings({ categories, title }) {
    try {
      flow.start();

      const res = yield store.Api.fetchListings({
        pub_category: categories,
        pub_title: title,
        include: ['images'],
      });

      console.log(res);

      store.list.set(res.data.data);
      // TODO: Set directly in entities store
      if (res.data.included) {
        store.imageList.set(res.data.included);
      }
      // getRoot(store).entities.merge(res.data.included);
      flow.success();
    } catch (err) {
      console.log(err);
      flow.failed();

      // TODO: move this alert into screen container
      AlertService.showAlert(
        i18n.t('alerts.somethingWentWrong.title'),
        i18n.t('alerts.somethingWentWrong.message'),
      );
    }
  };
}

function searchListings(flow, store) {
  return function* searchListings({ categories, title }) {
    try {
      flow.start();

      const res = yield store.Api.fetchListings({
        pub_category: categories,
        pub_title: title,
        include: ['images'],
      });

      console.log(res);

      store.searchList.set(res.data.data);

      // TODO: Set directly in entities store
      if (res.data.included) {
        store.imageList.set(res.data.included);
      }
      // getRoot(store).entities.merge(res.data.included);
      flow.success();
    } catch (err) {
      flow.failed();

      // TODO: move this alert into screen container
      AlertService.showAlert(
        i18n.t('alerts.somethingWentWrong.title'),
        i18n.t('alerts.somethingWentWrong.message'),
      );
    }
  };
}

function fetchOwnListings(flow, store) {
  return function* fetchOwnListings({ categories }) {
    try {
      flow.start();

      const res = yield store.Api.fetchOwnListings({
        pub_category: categories,
        include: ['images'],
      });

      console.log(res);

      store.ownList.set(res.data.data);

      // TODO: Set directly in entities store
      if (res.data.included) {
        store.imageList.set(res.data.included);
      }
      // getRoot(store).entities.merge(res.data.included);
      flow.success();
    } catch (err) {
      flow.failed();

      // TODO: move this alert into screen container
      AlertService.showAlert(
        i18n.t('alerts.somethingWentWrong.title'),
        i18n.t('alerts.somethingWentWrong.message'),
      );
    }
  };
}

export default ListingsStore;