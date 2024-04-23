@extends('layouts.installer')
@section('content')
<md-content flex="" layout-align="center center">
	<div>
		<md-card>
			<md-toolbar>
				<div class="md-toolbar-tools">
					<h2>
						<md-icon md-svg-icon="md-menu"></md-icon>
						<span>Setup wizard</span>
					</h2>
				</div>
			</md-toolbar>
			<md-steppers md-dynamic-height md-stretch-steppers="always" md-selected="selectedStep" md-busy-text="'Processing...'" md-busy="showBusyText">
				<md-step label="Welcome" md-complete="stepData[0].completed"  ng-disabled="stepProgress < 1">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[0])">
						<p>Welcome to the setup wizard</p>
						<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText">Next step</md-button>
						</form>
					</md-content>
					
				</md-step>
				<md-step label="Requirements" md-complete="stepData[1].completed" md-on-select="selectStep(1)" ng-disabled="stepProgress < 2">
					<md-content layout-padding>
						
						<form ng-submit="submitCurrentStep(stepData[1])">
							<md-list ng-repeat="(type,requirement) in stepData[1].data.requirements">
								<md-list-item>
									<strong>@{{ type }}</strong>
									<div ng-if="type=='php'">
										<strong>
											<small>
												(version @{{ stepData[1].data.phpSupportInfo['minimum'] }} required)
											</small>
										</strong>
										<span class="float-right">
											<strong>
												@{{ stepData[1].data.phpSupportInfo['current'] }}
											</strong>
											<i class="fa fa-fw fa-@{{ stepData[1].data.phpSupportInfo['supported'] ? 'check-circle' : 'exclamation-circle' }} row-icon" aria-hidden="true"></i>
										</span>
									</div>
								</md-list-item>
								<md-list-item  ng-repeat="(extention,enabled) in requirement">
									@{{ extention }}
									<i class="fa fa-fw fa-@{{ enabled ? 'check-circle' : 'exclamation-circle' }} row-icon" aria-hidden="true"></i>
								</md-list-item>
							</md-list>
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText || stepData[1].data.requirements['errors'] || !stepData[1].data.phpSupportInfo['supported']">Next step</md-button>
							<md-button class="md-raised md-primary" type="submit" ng-show="stepData[1].data.requirements['errors'] || !stepData[1].data.phpSupportInfo['supported']">Reload</md-button>
						</form>
					</md-content>
				</md-step>
				<md-step label="Permissions" md-complete="stepData[2].completed" md-on-select="selectStep(2)" ng-disabled="stepProgress < 3">
					<md-content layout-padding>
						<p>Ensure following files and folders are writable(set permission for file or folder to 777)</p>
						<form ng-submit="submitCurrentStep(stepData[2])">
							<md-list">
								<md-list-item ng-repeat="permission in stepData[2].data.permissions">
									@{{ permission.folder }}
									<i class="fa fa-fw fa-@{{ permission.isSet ? 'check-circle' : 'exclamation-circle' }} row-icon" aria-hidden="true"></i>
									@{{ permission.permission }}
								</md-list-item>
							</md-list>
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText || stepData[2].data['errors']">Next step</md-button>
							<md-button class="md-raised md-primary" type="button" ng-show="stepData[2].data['errors']" ng-click="reloadCurrentStep()">Reload</md-button>
						</form>
					</md-content>
				</md-step>
				<md-step label="Environments" md-complete="stepData[3].completed" md-on-select="selectStep(3)" ng-disabled="stepProgress < 4">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[3])" layout="row">
							<div flex="50">
							<md-input-container class="md-block">
								<label>Host name</label>
								<input type="text" ng-model="stepData[3].data.database_hostname" required>
							</md-input-container>
							<md-input-container class="md-block">
								<label>Database name</label>
								<input type="text" ng-model="stepData[3].data.database_name" required>
							</md-input-container>
							<md-input-container class="md-block">
								<label>Database username</label>
								<input type="text" ng-model="stepData[3].data.database_username" required>
							</md-input-container>
							<md-input-container class="md-block">
								<label>Database password</label>
								<input type="password" ng-model="stepData[3].data.database_password">
							</md-input-container>
						
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText">Next step</md-button>
							</div>
							<div flex="50">
						
							<md-input-container class="md-block">
								<label>Site URL</label>
								<input type="text" ng-model="stepData[3].data.app_url" required>
							</md-input-container>
							<md-input-container class="md-block">
								<label>Site Name</label>
								<input type="text" ng-model="stepData[3].data.app_name" required>
							</md-input-container>
							</div>
							
						</form>
					</md-content>
				</md-step>
				<md-step label="Create Admin" md-complete="stepData[4].completed" md-on-select="selectStep(4)" ng-disabled="stepProgress < 5">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[4])">
							<md-input-container class="md-block">
								<label>Admin email</label>
								<input type="email" ng-model="stepData[4].data.email" required>
							</md-input-container>
							<md-input-container class="md-block">
								<label>Admin password</label>
								<input type="password" ng-model="stepData[4].data.password" required>
							</md-input-container>
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText">Next</md-button>
						</form>
					</md-content>
				</md-step>
				<md-step label="Finalizing" md-complete="stepData[5].completed" md-on-select="selectStep(5)" ng-disabled="stepProgress < 6">
					<md-content layout-padding>
						<form ng-submit="submitCurrentStep(stepData[5])">
							<p>Your setup is completed</p>
							<md-button class="md-raised md-primary" type="submit" ng-disabled="showBusyText">Exit wizard</md-button>
						</form>
					</md-content>
				</md-step>
			</md-steppers>
		</md-card>
	</div>
</md-content>
@stop