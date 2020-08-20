import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RelativeTimePipe } from './relative-time.pipe';
import { ExcerptPipe } from "./excerpt.pipe";
import { GetValueByKeyPipe } from './get-value-by-key.pipe';
import { HighlightPipe } from './highlight.pipe';

const pipes = [
  RelativeTimePipe,
  ExcerptPipe,
  GetValueByKeyPipe,
  HighlightPipe
]

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: pipes,
  exports: pipes
})
export class SharedPipesModule {}