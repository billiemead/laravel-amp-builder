function msNavFoldService()
{
	var foldable = {};

	var service = {
		setFoldable    : setFoldable,
		isNavFoldedOpen: isNavFoldedOpen,
		toggleFold     : toggleFold,
		openFolded     : openFolded,
		closeFolded    : closeFolded
	};

	

	function setFoldable(scope, element)
	{
		foldable = {
			'scope'  : scope,
			'element': element
		};
	}

	function isNavFoldedOpen()
	{
		return foldable.scope.isNavFoldedOpen();
	}

	function toggleFold()
	{
		foldable.scope.toggleFold();
	}

	function openFolded()
	{
		foldable.scope.openFolded();
	}

	function closeFolded()
	{
		foldable.scope.closeFolded();
	}
	return service;
}
function msNavIsFoldedDirective($document, $rootScope, msNavFoldService)
{
	"ngInject";
	return {
		restrict: 'A',
		link    : function (scope, iElement, iAttrs)
		{
			var isFolded = (iAttrs.msNavIsFolded === 'true'),
				isFoldedOpen = false,
				body = angular.element($document[0].body),
				openOverlay = angular.element('<div id="navigation-fold-open-overlay"></div>'),
				closeOverlay = angular.element('<div id="navigation-fold-close-overlay"></div>');

			// Initialize the service
			msNavFoldService.setFoldable(scope, iElement, isFolded);

			// Set the fold status for the first time
			if ( isFolded )
			{
				fold();
			}
			else
			{
				unfold();
			}

			/**
			 * Is nav folded open
			 */
			function isNavFoldedOpen()
			{
				return isFoldedOpen;
			}

			/**
			 * Toggle fold
			 */
			function toggleFold()
			{
				isFolded = !isFolded;

				if ( isFolded )
				{
					fold();
				}
				else
				{
					unfold();
				}
			}

			/**
			 * Fold the navigation
			 */
			function fold()
			{
				// Add classes
				iElement.addClass('folded');
				body.addClass('navigation-folded');

				// Collapse everything and scroll to the top
				$rootScope.$broadcast('msNav::forceCollapse');
				iElement.find('ms-nav').scrollTop(0);

				// Append the openOverlay to the element
				
				iElement.append(openOverlay);
				// Event listeners
				openOverlay.on('mouseenter touchstart', function (event)
				{
					openFolded(event);
					isFoldedOpen = true;
				});
			}

			/**
			 * Open folded navigation
			 */
			function openFolded(event)
			{
				if ( angular.isDefined(event) )
				{
					event.preventDefault();
				}

				iElement.addClass('folded-open');

				// Update the location
				$rootScope.$broadcast('msNav::expandMatchingToggles');

				// Remove open overlay
				iElement.find(openOverlay).remove();

				// Append close overlay and bind its events
				iElement.parent().append(closeOverlay);
				closeOverlay.on('mouseenter touchstart', function (event)
				{
					closeFolded(event);
					isFoldedOpen = false;
				});
			}

			/**
			 * Close folded navigation
			 */
			function closeFolded(event)
			{
				if ( angular.isDefined(event) )
				{
					event.preventDefault();
				}

				// Collapse everything and scroll to the top
				$rootScope.$broadcast('msNav::forceCollapse');
				iElement.find('ms-nav').scrollTop(0);

				iElement.removeClass('folded-open');

				// Remove close overlay
				iElement.parent().find(closeOverlay).remove();

				// Append open overlay and bind its events
				iElement.append(openOverlay);
				openOverlay.on('mouseenter touchstart', function (event)
				{
					openFolded(event);
					isFoldedOpen = true;
				});
			}

			/**
			 * Unfold the navigation
			 */
			function unfold()
			{
				iElement.removeClass('folded');
				body.removeClass('navigation-folded');

				// Update the location
				$rootScope.$broadcast('msNav::expandMatchingToggles');

				iElement.off('mouseenter mouseleave');
			}

			// Expose functions to the scope
			scope.toggleFold = toggleFold;
			scope.openFolded = openFolded;
			scope.closeFolded = closeFolded;
			scope.isNavFoldedOpen = isNavFoldedOpen;

			// Cleanup
			scope.$on('$destroy', function ()
			{
				openOverlay.off('mouseenter touchstart');
				closeOverlay.off('mouseenter touchstart');
				iElement.off('mouseenter mouseleave');
			});
		}
	};
}
module.exports = {
   msNavFoldService,
   msNavIsFoldedDirective,
}