<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="x-ua-compatible" content="ie=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title><?=$title?></title>

	<?=$meta?>

	<link rel="icon" href="/favicon.ico" sizes="any">
	<link rel="icon" href="/favicon.svg" type="image/svg+xml">
	<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>
	<link rel="manifest" href="/manifest.json">
	<meta name="theme-color" content="#006938">

	<t4 type="navigation" name="Template: External Fonts" id="63" />
    <t4 type="navigation" name="Template: External CSS" id="31" />
    <t4 type="navigation" name="Template: Include Content Type CSS" id="43" />


	<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
	new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
	j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
	'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
	})(window,document,'script','dataLayer','GTM-NLVN8V');</script>

</head>

<body class="external-pages">
	<nav class="skip-nav-btn" aria-label="Skip header navigation"><a href="#content">Skip header navigation</a></nav>
	<!--
		MOBILE NAV
	-->
	<nav id="mobile-menu" class="c-mobile-menu" aria-label="mobile navigation">
		<a href="#" id="close_mobile_menu" class="closebtn hide">&times;</a>
		<ul class="sitemenu">
			<li><a href="/">Home</a>
				<ul class="visible">
					<li>
						<a href="/study/" data-sectId="study" class="mobMenuBreadcrumb">Study</a>
					</li>
					<li>
						<a href="/international/" data-sectId="international" class="mobMenuBreadcrumb">International</a>
					</li>
					<li>
						<a href="/research/" data-sectId="research" class="mobMenuBreadcrumb">Research</a>
					</li>
					<li>
						<a href="/about/" data-sectId="about" class="mobMenuBreadcrumb">About</a>
					</li>
					<li>
						<a href="/student-life/" data-sectId="student-life" class="mobMenuBreadcrumb">Student life</a>
					</li>
					<li>
						<a href="/courses/" data-sectId="courses" class="mobMenuBreadcrumb">Find a course</a>
					</li>
					<li>
						<a href="/clearing/" data-sectId="clearing" class="mobMenuBreadcrumb">Clearing</a>
					</li>
				</ul>
			</li>
		</ul>
		<ul class="slidemenu__other-links">
			<li class="slidemenu__other-links-portal"><a href="https://portal.stir.ac.uk/my-portal.jsp" rel="nofollow">My Portal</a></li>
			<li class="slidemenu__other-links-contact"><a href="/about/contact-us/">Contact</a></li>
			<li class="slidemenu__other-links-search"><a href="/search/">Search our site</a></li>
			<li class="slidemenu__other-links-microsite"><a href="http://stirlinguni.cn/" data-microsite="cn">中文网</a>
			</li>
		</ul>
	</nav>

	<!--
	MAIN HEADER
	-->
	<header class="c-header" id="layout-header" aria-label="main website header">
		<div class="grid-container">
			<div class="grid-x grid-padding-x">
				<div class="cell large-4 medium-4 small-8">
					<a href="/" title="University of Stirling"><img src="/webcomponents/dist/css/images/logos/logo.svg" alt="University of Stirling logo" class="c-site-logo"></a>
				</div>

				<nav aria-label="primary" class="cell large-8 medium-8 small-4 flex-container align-right">
					<div class="c-header-nav flex-container flex-dir-column align-bottom align-center">
						<ul class="c-header-nav c-header-nav--secondary u-font-semibold flex-container align-middle">
							<li class="c-header-nav__item show-for-medium">
								<a href="http://stirlinguni.cn/" class="c-header-nav__link" data-microsite="cn">中文网</a>
							</li>
							<li class="c-header-nav__item show-for-large">
								<a href="https://portal.stir.ac.uk/my-portal.jsp" rel="nofollow" class="c-header-nav__link" id="header-portal__button">My Portal</a>
							</li>
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" id="header-search__button" href="#">
									<span class="show-for-medium">Site search</span>
									<span class="c-header-nav__icon uos-magnifying-glass u-font-semibold"></span>
								</a>
							</li>
						</ul>
						<ul class="c-header-nav c-header-nav--primary u-font-bold show-for-xlarge">
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" data-menu-id="mm__study" href="/study/">Study</a>
							</li>
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" data-menu-id="mm__international" href="/international/">International</a>
							</li>
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" data-menu-id="mm__research" href="/research/">Research</a>
							</li>
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" data-menu-id="mm__about" href="/about/">About</a>
							</li>
							<li class="c-header-nav__item">
								<a class="c-header-nav__link" data-menu-id="mm__student-life" href="/student-life/">Student life</a>
							</li>
						</ul>
					</div>
					<div class="hide-for-xlarge flex-container align-middle align-center flex-dir-column">
						<a href="#" id="open_mobile_menu" class="c-header-burger flex-container align-middle">
							<span class="show-for-sr">Show/hide mobile menu</span>
							<span class="c-header-burger__bun"></span>
						</a>
						<span>Menu</span>
					</div>
				</nav>
			</div>
		</div>
		<form id="header-search" class="c-header-search" aria-hidden="true" aria-label="Popup for site search field"
			method="get" action="https://search.stir.ac.uk/s/search.html?collection=stir-main"
			data-js-action="/search/">

			<div class="overlay"></div>
			<div class="content">
				<div class="grid-container">
					<div class="grid-x">
						<div class="small-12 small-12 cell c-header-search__input-wrapper">

							<label class="show-for-sr" for="header-search__query">Site search</label>
							<input type="search" name="query" id="header-search__query" class="c-header-search__query"
								autocomplete="off" placeholder="Site search">

							<button class="button no-arrow" type="submit" aria-label="submit">
								<span class="uos-magnifying-glass"></span>
							</button>
						</div>
					</div>
				</div>


				<div class="u-bg-grey">
					<div class="grid-container">
						<div class="grid-x">
							<div class="small-12 small-12 cell u-relative">

								<div id="header-search__wrapper" class="c-header-search__wrapper hide-for-small-only"
									aria-hidden="true">
									<div id="header-search__results" class="grid-x c-header-search__results">
										<div class="cell medium-4 c-header-search__column c-header-search__suggestions">
										</div>

										<div class="cell medium-4 c-header-search__column c-header-search__news">
										</div>

										<div class="cell medium-4 c-header-search__column c-header-search__courses">
										</div>
									</div>
									<div id="header-search__loading" class="c-search-loading">
										<div class="c-search-loading__spinner"></div>
										<span class="show-for-sr">Loading...</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</form>
		<nav id="megamenu__container" aria-label="primary navigation submenu"></nav>
	</header>

	<!-- 
		BREADCRUMB 
	-->
	<!--beginnoindex-->

	<nav aria-label="breadcrumb" class="breadcrumbs-container u-bg-grey show-for-large">
		<div class="grid-container">
			<div class="grid-x grid-padding-x">
				<div class="cell">
					<ul class="breadcrumbs">
						<li><a href="/">Home</a></li> <?=$breadcrumb?>
					</ul>
				</div>
			</div>
		</div>
	</nav>

	<!--endnoindex-->

	<!-- 
		MAIN CONTENT 
	-->
	<main class="wrapper-content" aria-label="main content" id=content>
	<?=$body?>
	</main>

	<!-- 
		MAIN FOOTER 
	-->
	<footer>
		
		<?php echo file_get_contents('https://www.stir.ac.uk/developer-components/includes/template-external/template-footer/'); ?>
		<!-- Copyright Footer -->
		<div class="c-copyright u-bg-black" aria-label="copyright">
			<div class="grid-container">
				<div class="grid-x grid-padding-x">
					<div class="cell large-12 medium-12 small-12">
						<p>&copy; University of Stirling</p>
					</div>
				</div>
			</div>
		</div>
		<!-- Back to top button -->
		<a href="#" id="c-scroll-to-top-button" class="c-scroll-to-top flex-container align-middle align-center"><span
				class="show-for-sr">Scroll back to the top</span><span class="uos-arrows-up"></span></a>
	</footer>

	<t4 type="navigation" name="Template: Footer JS" id="32" />
	<?=$scripts?>
</body>

</html>