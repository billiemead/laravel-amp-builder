@extends('layouts.installer')
@section('content')
<md-content flex="" ng-controller="updateController">
	<div>
		<md-card>
			<md-toolbar>
				<div class="md-toolbar-tools">
					<h2>
						<md-icon md-svg-icon="md-menu"></md-icon>
						<span>Update wizard</span>
					</h2>
				</div>
			</md-toolbar>
			<md-steppers md-dynamic-height md-stretch-steppers="always" md-selected="selectedStep" md-busy-text="'Processing...'" md-busy="showBusyText">
				<md-step label="Welcome" md-complete="stepData[0].completed"  ng-disabled="stepProgress < 1">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[0])">
						{{ trans('installer_messages.updater.welcome.message') }}
						<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText">Next step</md-button>
						</form>
					</md-content>
					
				</md-step>
				
				<md-step label="Overview" md-complete="stepData[1].completed" md-on-select="selectStep(1)" ng-disabled="stepProgress < 2">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[2])">
							<p class="paragraph text-center">{{ trans_choice("installer_messages.updater.overview.message", "stepData[1].data.numberOfUpdatesPending", ["number" => "stepData[1].data.numberOfUpdatesPending"]) }}</p>
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText || stepData[1].data['errors']">{{trans('installer_messages.updater.overview.install_updates') }}</md-button>
						</form>
					</md-content>
				</md-step>
				
				<md-step label="Finalizing" md-complete="stepData[2].completed" md-on-select="selectStep(2)" ng-disabled="stepProgress < 3">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[5])">
							
							<p>Your update is completed</p>
							<a class="md-button md-raised md-primary" ng-disabled="showBusyText" href="{{url('admin')}}">{{ trans('installer_messages.updater.final.exit') }}</a>
						</form>
					</md-content>
				</md-step>
			</md-steppers>
		</md-card>
	</div>
</md-content>
@stop