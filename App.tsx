import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo, useState } from 'react';
import {
  BackHandler,
  Image,
  PanResponder,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { products, specialties } from './src/config/catalog';

export default function App() {
  const { width } = useWindowDimensions();
  const isCompact = width < 720;
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState<string>(
    specialties[0].id,
  );
  const [hasEnteredApp, setHasEnteredApp] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDetailing, setIsDetailing] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);

  const selectedSpecialty =
    specialties.find((specialty) => specialty.id === selectedSpecialtyId) ??
    specialties[0];
  const specialtyProducts = selectedSpecialty.productIds
    .map((productId) => products.find((product) => product.id === productId))
    .filter((product) => product !== undefined);
  const currentProduct = specialtyProducts[slideIndex];
  const slideCount = specialtyProducts.length;

  function selectSpecialty(specialtyId: string) {
    setSelectedSpecialtyId(specialtyId);
    setSlideIndex(0);
    setIsDetailing(false);
    setIsMenuOpen(false);
  }

  function openDetailing() {
    if (slideCount > 0) {
      setIsDetailing(true);
    }
  }

  function closeDetailing() {
    setIsDetailing(false);
  }

  function showPreviousSlide() {
    setSlideIndex((index) => (index - 1 + slideCount) % slideCount);
  }

  function showNextSlide() {
    setSlideIndex((index) => (index + 1) % slideCount);
  }

  useEffect(() => {
    if (!isDetailing && !isMenuOpen) {
      return;
    }

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        } else {
          closeDetailing();
        }
        return true;
      },
    );

    return () => subscription.remove();
  }, [isDetailing, isMenuOpen]);

  const swipeHandlers = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dx) > 24 &&
          Math.abs(gesture.dx) > Math.abs(gesture.dy),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx < -45) {
            showNextSlide();
          } else if (gesture.dx > 45) {
            showPreviousSlide();
          }
        },
      }),
    [slideCount],
  );

  function renderSpecialtyMenu(inDrawer = false) {
    return (
      <View style={[styles.sidebar, inDrawer && styles.drawerSidebar]}>
        <View style={styles.sidebarBrand}>
          <Image
            accessibilityLabel="Crasenim Pharma"
            resizeMode="contain"
            source={require('./assets/crasenim-logo.jpeg')}
            style={styles.sidebarLogo}
          />
          <Text style={styles.sidebarHeading}>Doctor specialties</Text>
          <Text style={styles.sidebarSubheading}>
            Select a specialty to browse products
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.specialtyList}
          showsVerticalScrollIndicator={false}
        >
          {specialties.map((specialty) => {
            const isSelected = specialty.id === selectedSpecialtyId;

            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                key={specialty.id}
                onPress={() => selectSpecialty(specialty.id)}
                style={({ pressed }) => [
                  styles.specialtyButton,
                  isSelected && styles.specialtyButtonSelected,
                  pressed && styles.specialtyButtonPressed,
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.specialtyLabel,
                    isSelected && styles.specialtyLabelSelected,
                  ]}
                >
                  {specialty.name}
                </Text>
                <Text
                  style={[
                    styles.specialtyCount,
                    isSelected && styles.specialtyCountSelected,
                  ]}
                >
                  {specialty.productIds.length}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDetailing ? 'light' : 'dark'} />
      {!hasEnteredApp ? (
        <View style={styles.welcomeScreen}>
          <Image
            accessibilityLabel="Crasenim Pharma"
            resizeMode="contain"
            source={require('./assets/crasenim-logo.jpeg')}
            style={styles.welcomeLogo}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => setHasEnteredApp(true)}
            style={({ pressed }) => [
              styles.loginButton,
              pressed && styles.detailButtonPressed,
            ]}
          >
            <Text style={styles.loginButtonLabel}>Login</Text>
          </Pressable>
        </View>
      ) : isDetailing && currentProduct ? (
        <View style={styles.detailingScreen}>
          <View style={styles.detailImageArea} {...swipeHandlers.panHandlers}>
            <Image
              accessibilityLabel={`${currentProduct.name} product slide`}
              resizeMode="contain"
              source={currentProduct.image}
              style={styles.detailProductImage}
            />
          </View>
          <Pressable
            accessibilityLabel="Close detailing"
            accessibilityRole="button"
            onPress={closeDetailing}
            style={({ pressed }) => [
              styles.detailCloseButton,
              pressed && styles.detailButtonPressed,
            ]}
          >
            <Text style={styles.detailCloseLabel}>×</Text>
            <Text style={styles.detailCloseText}>Close</Text>
          </Pressable>
          <View style={styles.detailFooter}>
            <Pressable
              accessibilityLabel="Previous product"
              accessibilityRole="button"
              onPress={showPreviousSlide}
              style={({ pressed }) => [
                styles.detailArrowButton,
                pressed && styles.detailButtonPressed,
              ]}
            >
              <Text style={styles.detailArrowLabel}>‹</Text>
            </Pressable>
            <View style={styles.detailInformation}>
              <Text numberOfLines={1} style={styles.detailProductName}>
                {currentProduct.name}
              </Text>
              <Text style={styles.detailSlideCount}>
                {slideIndex + 1} / {slideCount}
              </Text>
            </View>
            <Pressable
              accessibilityLabel="Next product"
              accessibilityRole="button"
              onPress={showNextSlide}
              style={({ pressed }) => [
                styles.detailArrowButton,
                pressed && styles.detailButtonPressed,
              ]}
            >
              <Text style={styles.detailArrowLabel}>›</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.app}>
          {!isCompact ? renderSpecialtyMenu() : null}

          <View style={styles.main}>
            <View style={styles.topBar}>
              {isCompact ? (
                <Pressable
                  accessibilityLabel="Open doctor specialties"
                  accessibilityRole="button"
                  onPress={() => setIsMenuOpen(true)}
                  style={styles.menuButton}
                >
                  <Text style={styles.menuButtonText}>☰</Text>
                </Pressable>
              ) : null}
              <View style={styles.topBarCopy}>
                <Text style={styles.topBarEyebrow}>CRASENIM PHARMA</Text>
                <Text style={styles.topBarTitle}>Product catalogue</Text>
              </View>
              {isCompact ? (
                <View style={styles.mobileSpecialtyPill}>
                  <Text numberOfLines={1} style={styles.mobileSpecialtyText}>
                    {selectedSpecialty.shortName}
                  </Text>
                </View>
              ) : null}
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ disabled: slideCount === 0 }}
                disabled={slideCount === 0}
                onPress={openDetailing}
                style={({ pressed }) => [
                  styles.detailingButton,
                  slideCount === 0 && styles.detailingButtonDisabled,
                  pressed && styles.detailButtonPressed,
                ]}
              >
                <Text style={styles.detailingButtonLabel}>Detailing</Text>
              </Pressable>
            </View>

            <View style={styles.catalog}>
              <View style={styles.catalogHeading}>
                <Text style={styles.specialtyTitle}>
                  {selectedSpecialty.name}
                </Text>
                <Text style={styles.catalogHint}>
                  {slideCount} product slides available
                </Text>
              </View>

              {slideCount > 0 ? (
                <View style={styles.readyCard}>
                  <View style={styles.readyIcon}>
                    <Text style={styles.readyIconLabel}>Rx</Text>
                  </View>
                  <Text style={styles.readyTitle}>Ready to start detailing?</Text>
                  <Text style={styles.readyDescription}>
                    Open the full-screen presentation to show product slides
                    for {selectedSpecialty.shortName}.
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={openDetailing}
                    style={({ pressed }) => [
                      styles.readyButton,
                      pressed && styles.detailButtonPressed,
                    ]}
                  >
                    <Text style={styles.readyButtonLabel}>
                      Start detailing
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyTitle}>No products assigned yet</Text>
                  <Text style={styles.emptyDescription}>
                    Add product IDs for this specialty in the catalogue
                    configuration.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {!isDetailing && isCompact && isMenuOpen ? (
        <View style={styles.drawerLayer}>
          <Pressable
            accessibilityLabel="Close specialties menu"
            onPress={() => setIsMenuOpen(false)}
            style={styles.drawerScrim}
          />
          <View style={styles.drawer}>{renderSpecialtyMenu(true)}</View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#F4F7FB',
    flex: 1,
  },
  welcomeScreen: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  welcomeLogo: {
    height: '62%',
    maxHeight: 420,
    maxWidth: 760,
    width: '78%',
  },
  loginButton: {
    alignItems: 'center',
    backgroundColor: '#173A68',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 50,
    minWidth: 180,
    paddingHorizontal: 28,
  },
  loginButtonLabel: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  detailingScreen: {
    backgroundColor: '#111827',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  detailImageArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  detailProductImage: {
    height: '100%',
    width: '100%',
  },
  detailCloseButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 42,
    paddingHorizontal: 14,
    position: 'absolute',
    right: 22,
    top: 18,
  },
  detailCloseLabel: {
    color: '#FFFFFF',
    fontSize: 23,
    lineHeight: 26,
  },
  detailCloseText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  detailFooter: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    borderColor: 'rgba(255, 255, 255, 0.18)',
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    marginTop: 8,
    maxWidth: 360,
    minHeight: 56,
    paddingHorizontal: 8,
    paddingVertical: 6,
    width: '100%',
  },
  detailArrowButton: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  detailArrowLabel: {
    color: '#173A68',
    fontSize: 32,
    fontWeight: '300',
    lineHeight: 36,
    marginTop: -3,
  },
  detailInformation: {
    alignItems: 'center',
    flex: 1,
  },
  detailProductName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  detailSlideCount: {
    color: '#D5DEE9',
    fontSize: 11,
    marginTop: 2,
  },
  detailButtonPressed: {
    opacity: 0.72,
  },
  app: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    backgroundColor: '#FFFFFF',
    borderRightColor: '#E5EAF0',
    borderRightWidth: 1,
    flexGrow: 0,
    flexShrink: 0,
    width: 280,
  },
  drawerSidebar: {
    borderRightWidth: 0,
    width: '100%',
  },
  sidebarBrand: {
    borderBottomColor: '#E8EDF3',
    borderBottomWidth: 1,
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 12,
  },
  sidebarLogo: {
    height: 72,
    marginBottom: 18,
    width: 150,
  },
  sidebarHeading: {
    color: '#173A68',
    fontSize: 18,
    fontWeight: '700',
  },
  sidebarSubheading: {
    color: '#718096',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  specialtyList: {
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  specialtyButton: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 42,
    paddingHorizontal: 11,
  },
  specialtyButtonSelected: {
    backgroundColor: '#E9F5FA',
  },
  specialtyButtonPressed: {
    opacity: 0.75,
  },
  specialtyLabel: {
    color: '#475569',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  specialtyLabelSelected: {
    color: '#087C9A',
    fontWeight: '700',
  },
  specialtyCount: {
    color: '#94A3B8',
    fontSize: 11,
    marginLeft: 8,
  },
  specialtyCountSelected: {
    color: '#087C9A',
  },
  main: {
    backgroundColor: '#F4F7FB',
    flex: 1,
    minWidth: 0,
  },
  topBar: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#E5EAF0',
    borderBottomWidth: 1,
    flexDirection: 'row',
    minHeight: 70,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  menuButton: {
    alignItems: 'center',
    backgroundColor: '#EFF5F8',
    borderRadius: 11,
    height: 42,
    justifyContent: 'center',
    marginRight: 12,
    width: 42,
  },
  menuButtonText: {
    color: '#173A68',
    fontSize: 21,
  },
  topBarCopy: {
    flex: 1,
  },
  topBarEyebrow: {
    color: '#168FAF',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  topBarTitle: {
    color: '#173A68',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 3,
  },
  mobileSpecialtyPill: {
    backgroundColor: '#E9F5FA',
    borderRadius: 16,
    maxWidth: 106,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  mobileSpecialtyText: {
    color: '#087C9A',
    fontSize: 11,
    fontWeight: '600',
  },
  detailingButton: {
    alignItems: 'center',
    backgroundColor: '#173A68',
    borderRadius: 11,
    justifyContent: 'center',
    marginLeft: 10,
    minHeight: 42,
    paddingHorizontal: 16,
  },
  detailingButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
  detailingButtonLabel: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  catalog: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 8,
  },
  catalogHeading: {
    alignItems: 'center',
    marginBottom: 12,
  },
  specialtyTitle: {
    color: '#173A68',
    fontSize: 21,
    fontWeight: '700',
    textAlign: 'center',
  },
  catalogHint: {
    color: '#718096',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  readyCard: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E4EAF0',
    borderRadius: 18,
    borderWidth: 1,
    maxWidth: 420,
    paddingHorizontal: 28,
    paddingVertical: 28,
    width: '100%',
  },
  readyIcon: {
    alignItems: 'center',
    backgroundColor: '#E9F5FA',
    borderRadius: 26,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  readyIconLabel: {
    color: '#087C9A',
    fontSize: 19,
    fontWeight: '700',
  },
  readyTitle: {
    color: '#173A68',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
  readyDescription: {
    color: '#718096',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center',
  },
  readyButton: {
    alignItems: 'center',
    backgroundColor: '#168FAF',
    borderRadius: 11,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 46,
    paddingHorizontal: 22,
  },
  readyButtonLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E4EAF0',
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    color: '#173A68',
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyDescription: {
    color: '#718096',
    fontSize: 13,
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 300,
    textAlign: 'center',
  },
  drawerLayer: {
    bottom: 0,
    left: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 10,
  },
  drawerScrim: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    height: '100%',
    maxWidth: 320,
    width: '82%',
  },
});
