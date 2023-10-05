/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
// Original code copied and simplified from the link below as the codebase is currently not maintained:
// https://github.com/jobtoday/react-native-image-viewing

import React, {
  ComponentType,
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StyleSheet,
  View,
  VirtualizedList,
  ModalProps,
  Platform,
} from 'react-native'
import {ModalsContainer} from '../../modals/Modal'

import ImageItem from './components/ImageItem/ImageItem'
import ImageDefaultHeader from './components/ImageDefaultHeader'

import {ImageSource, Dimensions as ScreenDimensions} from './@types'
import {Edge, SafeAreaView} from 'react-native-safe-area-context'

type Props = {
  images: ImageSource[]
  keyExtractor?: (imageSrc: ImageSource, index: number) => string
  imageIndex: number
  visible: boolean
  onRequestClose: () => void
  onImageIndexChange?: (imageIndex: number) => void
  presentationStyle?: ModalProps['presentationStyle']
  animationType?: ModalProps['animationType']
  backgroundColor?: string
  swipeToCloseEnabled?: boolean
  HeaderComponent?: ComponentType<{imageIndex: number}>
  FooterComponent?: ComponentType<{imageIndex: number}>
}

const DEFAULT_BG_COLOR = '#000'
const SCREEN = Dimensions.get('screen')
const SCREEN_WIDTH = SCREEN.width

function ImageViewing({
  images,
  keyExtractor,
  imageIndex,
  visible,
  onRequestClose,
  onImageIndexChange,
  backgroundColor = DEFAULT_BG_COLOR,
  swipeToCloseEnabled,
  HeaderComponent,
  FooterComponent,
}: Props) {
  const imageList = useRef<VirtualizedList<ImageSource>>(null)
  const [opacity, onRequestCloseEnhanced] = useRequestClose(onRequestClose)
  const [currentImageIndex, onScroll] = useImageIndexChange(imageIndex, SCREEN)
  const [headerTransform, footerTransform, toggleBarsVisible] =
    useAnimatedComponents()

  useEffect(() => {
    if (onImageIndexChange) {
      onImageIndexChange(currentImageIndex)
    }
  }, [currentImageIndex, onImageIndexChange])

  const onZoom = useCallback(
    (isScaled: boolean) => {
      // @ts-ignore
      imageList?.current?.setNativeProps({scrollEnabled: !isScaled})
      toggleBarsVisible(!isScaled)
    },
    [toggleBarsVisible],
  )

  const edges = useMemo(() => {
    if (Platform.OS === 'android') {
      return ['top', 'bottom', 'left', 'right'] satisfies Edge[]
    }
    return ['left', 'right'] satisfies Edge[] // iOS, so no top/bottom safe area
  }, [])

  const onLayout = useCallback(() => {
    if (imageIndex) {
      imageList.current?.scrollToIndex({index: imageIndex, animated: false})
    }
  }, [imageList, imageIndex])

  if (!visible) {
    return null
  }

  return (
    <SafeAreaView
      style={styles.screen}
      onLayout={onLayout}
      edges={edges}
      aria-modal
      accessibilityViewIsModal>
      <ModalsContainer />
      <View style={[styles.container, {opacity, backgroundColor}]}>
        <Animated.View style={[styles.header, {transform: headerTransform}]}>
          {typeof HeaderComponent !== 'undefined' ? (
            React.createElement(HeaderComponent, {
              imageIndex: currentImageIndex,
            })
          ) : (
            <ImageDefaultHeader onRequestClose={onRequestCloseEnhanced} />
          )}
        </Animated.View>
        <VirtualizedList
          ref={imageList}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          getItem={(_, index) => images[index]}
          getItemCount={() => images.length}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
          renderItem={({item: imageSrc}) => (
            <ImageItem
              onZoom={onZoom}
              imageSrc={imageSrc}
              onRequestClose={onRequestCloseEnhanced}
              swipeToCloseEnabled={swipeToCloseEnabled}
            />
          )}
          onMomentumScrollEnd={onScroll}
          //@ts-ignore
          keyExtractor={(imageSrc, index) =>
            keyExtractor
              ? keyExtractor(imageSrc, index)
              : typeof imageSrc === 'number'
              ? `${imageSrc}`
              : imageSrc.uri
          }
        />
        {typeof FooterComponent !== 'undefined' && (
          <Animated.View style={[styles.footer, {transform: footerTransform}]}>
            {React.createElement(FooterComponent, {
              imageIndex: currentImageIndex,
            })}
          </Animated.View>
        )}
      </View>
    </SafeAreaView>
  )
}

const INITIAL_POSITION = {x: 0, y: 0}
const ANIMATION_CONFIG = {
  duration: 200,
  useNativeDriver: true,
}

const useAnimatedComponents = () => {
  const headerTranslate = new Animated.ValueXY(INITIAL_POSITION)
  const footerTranslate = new Animated.ValueXY(INITIAL_POSITION)

  const toggleVisible = (isVisible: boolean) => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(headerTranslate.y, {...ANIMATION_CONFIG, toValue: 0}),
        Animated.timing(footerTranslate.y, {...ANIMATION_CONFIG, toValue: 0}),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(headerTranslate.y, {
          ...ANIMATION_CONFIG,
          toValue: -300,
        }),
        Animated.timing(footerTranslate.y, {
          ...ANIMATION_CONFIG,
          toValue: 300,
        }),
      ]).start()
    }
  }

  const headerTransform = headerTranslate.getTranslateTransform()
  const footerTransform = footerTranslate.getTranslateTransform()

  return [headerTransform, footerTransform, toggleVisible] as const
}

const useRequestClose = (onRequestClose: () => void) => {
  const [opacity, setOpacity] = useState(1)

  return [
    opacity,
    () => {
      setOpacity(0)
      onRequestClose()
      setTimeout(() => setOpacity(1), 0)
    },
  ] as const
}

const useImageIndexChange = (imageIndex: number, screen: ScreenDimensions) => {
  const [currentImageIndex, setImageIndex] = useState(imageIndex)
  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const {
      nativeEvent: {
        contentOffset: {x: scrollX},
      },
    } = event

    if (screen.width) {
      const nextIndex = Math.round(scrollX / screen.width)
      setImageIndex(nextIndex < 0 ? 0 : nextIndex)
    }
  }

  return [currentImageIndex, onScroll] as const
}

const styles = StyleSheet.create({
  screen: {
    position: 'absolute',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    top: 0,
    pointerEvents: 'box-none',
  },
  footer: {
    position: 'absolute',
    width: '100%',
    zIndex: 1,
    bottom: 0,
  },
})

const EnhancedImageViewing = (props: Props) => (
  <ImageViewing key={props.imageIndex} {...props} />
)

export default EnhancedImageViewing
