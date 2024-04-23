export default angular.module('ms-navigation', [])

.factory('ldNavFoldService', function()
{
	var compactable = {};

	return {
		setCompactable    : function setCompactable(scope, element)
		{
			compactable = {
				'scope'  : scope,
				'element': element
			};
		},
		isNavCompactedOpen: function isNavCompactedOpen()
		{
			return compactable.scope.isNavCompactedOpen();
		},
		toggleCompact: function toggleCompact()
		{
			compactable.scope.toggleCompact();
		},
		openCompacted: function openCompacted()
		{
			compactable.scope.openCompacted();
		},
		closeCompacted: function closeCompacted()
		{
			compactable.scope.closeCompacted();
		}
	};

	
})
.directive('ldNavIsCompacted',  function ldNavIsCompactedDirective($document, $rootScope, ldNavFoldService)
{
	"ngInject";
	return {
		restrict: 'A',
		link    : function (scope, iElement, iAttrs)
		{
			var isCompacted = (iAttrs.ldNavIsCompacted === 'true'),
				isCompactedOpen = false,
				body = angular.element($document[0].body),
				openOverlay = angular.element('<div id="navigation-compact-open-overlay"></div>'),
				closeOverlay = angular.element('<div id="navigation-compact-close-overlay"></div>');

			// Initialize the service
			ldNavFoldService.setCompactable(scope, iElement, isCompacted);

			// Set the fold status for the first time
			if ( isCompacted )
			{
				enableCompactMode();
			}
			else
			{
				disableCompactMode();
			}

			

			

			/**
			 * Fold the navigation
			 */
			function enableCompactMode()
			{
				// Add classes
				iElement.addClass('compacted');
				body.addClass('navigation-compacted');

				// Collapse everything and scroll to the top
				$rootScope.$broadcast('ldNav::forceCollapse');
				iElement.find('ms-nav').scrollTop(0);

				// Append the openOverlay to the element
				
				iElement.append(openOverlay);
				// Event listeners
				openOverlay.on('mouseenter touchstart', function (event)
				{
					scope.openCompacted(event);
					isCompactedOpen = true;
				});
			}

			

			

			/**
			 * Unfold the navigation
			 */
			function disableCompactMode()
			{
				iElement.removeClass('compacted');
				body.removeClass('navigation-compacted');

				// Update the location
				$rootScope.$broadcast('ldNav::expandMatchingToggles');

				iElement.off('mouseenter mouseleave');
			}

			// Expose functions to the scope
			scope.toggleCompact = function()
			{
				isCompacted = !isCompacted;

				if ( isCompacted )
				{
					enableCompactMode();
				}
				else
				{
					disableCompactMode();
				}
			};
			scope.openCompacted = function(event)
			{
				if ( angular.isDefined(event) )
				{
					event.preventDefault();
				}

				iElement.addClass('compacted-open');

				// Update the location
				$rootScope.$broadcast('ldNav::expandMatchingToggles');

				// Remove open overlay
				iElement.find(openOverlay).remove();

				// Append close overlay and bind its events
				iElement.parent().append(closeOverlay);
				closeOverlay.on('mouseenter touchstart', function (event)
				{
					scope.closeCompacted(event);
					isCompactedOpen = false;
				});
			};
			scope.closeCompacted = function(event)
			{
				if ( angular.isDefined(event) )
				{
					event.preventDefault();
				}

				// Collapse everything and scroll to the top
				$rootScope.$broadcast('ldNav::forceCollapse');
				iElement.find('ms-nav').scrollTop(0);

				iElement.removeClass('compacted-open');

				// Remove close overlay
				iElement.parent().find(closeOverlay).remove();

				// Append open overlay and bind its events
				iElement.append(openOverlay);
				openOverlay.on('mouseenter touchstart', function (event)
				{
					scope.openCompacted(event);
					isCompactedOpen = true;
				});
			};
			scope.isNavCompactedOpen = function()
			{
				return isCompactedOpen;
			};

			// Cleanup
			scope.$on('$destroy', function ()
			{
				openOverlay.off('mouseenter touchstart');
				closeOverlay.off('mouseenter touchstart');
				iElement.off('mouseenter mouseleave');
			});
		}
	};
})
.directive('ldNavCompactSwitcher',  function ldNavCompactSwitcherDirective(ldNavFoldService)
{
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs)
		{
			angular.element(iElement).click(function()
			{
				ldNavFoldService.toggleCompact();
			})
		}
	}
})
.directive('ldNavigation',  function ldNavigationDirective($rootScope, $mdComponentRegistry, ldNavFoldService)
{
	return {
		link: function (scope, iElement, iAttrs)
		{
			$rootScope.$on('$stateChangeSuccess', function ()
			{
				$rootScope.$broadcast('msNav::expandMatchingToggles');

				$mdComponentRegistry.when('navigation').then(function (navigation)
				{
					navigation.close();
					if ( ldNavFoldService.isNavCompactedOpen() )
					{
						ldNavFoldService.closeCompacted();
					}
				});
			});
		}
	}
})
.directive('ldSidenavToggle',  function($mdSidenav)
{
	return {
		restrict: 'A',
		link: function (scope, iElement, iAttrs)
		{
			angular.element(iElement).click(function()
			{
				$mdSidenav(iAttrs.ldSidenavToggle).toggle();
			})
		}
	}
})
.name;