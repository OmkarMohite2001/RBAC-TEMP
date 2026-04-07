import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NzLayoutModule } from "ng-zorro-antd/layout";
import { NzFlexModule } from "ng-zorro-antd/flex";

@Component({
  selector: "app-auth-layout",
  imports: [RouterOutlet, NzLayoutModule, NzFlexModule],
  styleUrl: "./auth-layout.component.scss",
  templateUrl: "./auth-layout.component.html",
})
export class AuthLayoutComponent {}
