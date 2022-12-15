import React, {useEffect, useState} from 'react'
import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  StyleProp,
  Text,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native'
import {
  Record as PostRecord,
  Entity,
} from '../../../third-party/api/src/client/types/app/bsky/feed/post'
import * as AppBskyEmbedImages from '../../../third-party/api/src/client/types/app/bsky/embed/images'
import * as AppBskyEmbedExternal from '../../../third-party/api/src/client/types/app/bsky/embed/external'
import {Link} from '../util/Link'
import {LinkMeta, getLikelyType, LikelyType} from '../../../lib/link-meta'
import {colors} from '../../lib/styles'
import {AutoSizedImage} from './images/AutoSizedImage'

type Embed =
  | AppBskyEmbedImages.Presented
  | AppBskyEmbedExternal.Presented
  | {$type: string; [k: string]: unknown}

export function PostEmbeds({
  embed,
  style,
}: {
  embed?: Embed
  style?: StyleProp<ViewStyle>
}) {
  if (embed?.$type === 'app.bsky.embed.images#presented') {
    const imgEmbed = embed as AppBskyEmbedImages.Presented
    if (imgEmbed.images.length > 0) {
      const Thumb = ({i, style}: {i: number; style: StyleProp<ImageStyle>}) => (
        <AutoSizedImage
          style={style}
          uri={imgEmbed.images[i].thumb}
          fullSizeUri={imgEmbed.images[i].fullsize}
        />
      )
      if (imgEmbed.images.length === 4) {
        return (
          <View style={styles.imagesContainer}>
            <View style={styles.imagePair}>
              <Thumb i={0} style={styles.imagePairItem} />
              <View style={styles.imagesWidthSpacer} />
              <Thumb i={1} style={styles.imagePairItem} />
            </View>
            <View style={styles.imagesHeightSpacer} />
            <View style={styles.imagePair}>
              <Thumb i={2} style={styles.imagePairItem} />
              <View style={styles.imagesWidthSpacer} />
              <Thumb i={3} style={styles.imagePairItem} />
            </View>
          </View>
        )
      } else if (imgEmbed.images.length === 3) {
        return (
          <View style={styles.imagesContainer}>
            <View style={styles.imageWide}>
              <Thumb i={0} style={styles.imageWideItem} />
            </View>
            <View style={styles.imagesHeightSpacer} />
            <View style={styles.imagePair}>
              <Thumb i={1} style={styles.imagePairItem} />
              <View style={styles.imagesWidthSpacer} />
              <Thumb i={2} style={styles.imagePairItem} />
            </View>
          </View>
        )
      } else if (imgEmbed.images.length === 2) {
        return (
          <View style={styles.imagesContainer}>
            <View style={styles.imagePair}>
              <Thumb i={0} style={styles.imagePairItem} />
              <View style={styles.imagesWidthSpacer} />
              <Thumb i={1} style={styles.imagePairItem} />
            </View>
          </View>
        )
      } else {
        return (
          <View style={styles.imagesContainer}>
            <View style={styles.imageBig}>
              <Thumb i={0} style={styles.imageBigItem} />
            </View>
          </View>
        )
      }
    }
  }
  if (embed?.$type === 'app.bsky.embed.external#presented') {
    const externalEmbed = embed as AppBskyEmbedExternal.Presented
    const link = externalEmbed.external
    return (
      <Link style={[styles.extOuter, style]} href={link.uri}>
        {link.thumb ? (
          <AutoSizedImage style={style} uri={link.thumb} />
        ) : undefined}
        <Text numberOfLines={1} style={styles.extTitle}>
          {link.title || link.uri}
        </Text>
        <Text numberOfLines={1} style={styles.extUrl}>
          {link.uri}
        </Text>
        {link.description ? (
          <Text numberOfLines={2} style={styles.extDescription}>
            {link.description}
          </Text>
        ) : undefined}
      </Link>
    )
  }
  return <View />
}

const styles = StyleSheet.create({
  imagesContainer: {
    marginBottom: 10,
  },
  imagesWidthSpacer: {
    width: 5,
  },
  imagesHeightSpacer: {
    height: 5,
  },
  imagePair: {
    flexDirection: 'row',
  },
  imagePairItem: {
    resizeMode: 'contain',
    flex: 1,
    borderRadius: 4,
  },
  imageWide: {},
  imageWideItem: {
    resizeMode: 'contain',
    borderRadius: 4,
  },
  imageBig: {},
  imageBigItem: {
    borderRadius: 4,
  },

  extOuter: {
    borderWidth: 1,
    borderColor: colors.gray2,
    borderRadius: 8,
    padding: 10,
  },
  extImage: {
    // TODO
  },
  extTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  extDescription: {
    marginTop: 4,
    fontSize: 15,
  },
  extUrl: {
    color: colors.gray4,
  },
})
