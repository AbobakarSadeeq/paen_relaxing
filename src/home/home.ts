import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomeService } from './home.service';
// import { HomeService } from './home.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: []
})

export class Home {

  categoriesWithItsRelaxingSounds: any[] = [];
  choosedRelaxingSounds: any[] = [];

  constructor(private _homeService: HomeService) { }

  ngOnInit(): void {
    this._homeService.getAllCategoriesWithRelaxingSounds().subscribe((data: any) => {
      this.categoriesWithItsRelaxingSounds = data;
      this.getChoosedRelaxingAudioFromLocalStorage();

    });
  }


  getChoosedRelaxingAudioFromLocalStorage(): void {
    if (localStorage.getItem('RelaxingSounds')) {
      const savedSoundIdList = [...JSON.parse(localStorage.getItem('RelaxingSounds')!)];
      for (var singleCategoryIdAndSoundId of savedSoundIdList) {
        const categoryIdIndex = this.categoriesWithItsRelaxingSounds.findIndex(singleCategory => singleCategory['categoryId'] == singleCategoryIdAndSoundId['categoryId']);
        const selectedCategoryAllSounds = [...this.categoriesWithItsRelaxingSounds[categoryIdIndex].relaxingSounds];
        const selectedCategorySoundIdIndex = selectedCategoryAllSounds.findIndex(singleSound => singleSound['soundId'] == singleCategoryIdAndSoundId['soundId']);
        const categoryId = this.categoriesWithItsRelaxingSounds[categoryIdIndex]['categoryId'];
        const soundId = this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['soundId'];


        // below condition check is it sound already found on home page or not if not then do not push it again to the list and just skip it
        if (this.choosedRelaxingSounds.findIndex(singleSound => singleSound['categoryId'] == categoryId &&
          singleSound['soundId'] == soundId) == -1) {
          const audio = new Audio(this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['soundAudioLocation']);
          audio.loop = true;
          audio.volume = 0.5;

          // add to that sound whose already selected or already in selected home for to not select it again.
          this.categoriesWithItsRelaxingSounds[categoryIdIndex].relaxingSounds[selectedCategorySoundIdIndex].isAlreadySelected = true;

          this.choosedRelaxingSounds.push({
            categoryId: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['categoryId'],
            soundId: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['soundId'],
            soundName: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['name'],
            soundLocation: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['soundAudioLocation'],
            soundImage: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIdIndex]['soundImageLocation'],
            playPauseSoundState: false,
            eachSoundAudioObj: audio
          });
        }

      }
      console.log(this.categoriesWithItsRelaxingSounds);
    }
  }

  playSound(index: number) {
    this.choosedRelaxingSounds[index]['playPauseSoundState'] = true;
    this.choosedRelaxingSounds[index]['eachSoundAudioObj'].play();
  }

  stopSound(index: number): void {
    this.choosedRelaxingSounds[index]['playPauseSoundState'] = false;
    this.choosedRelaxingSounds[index]['eachSoundAudioObj'].pause();
  }

  changeSoundVolume(index: number, event: Event) {
    const slider = event.target as HTMLInputElement;
    const currentVolume = parseInt(slider.value);
    this.choosedRelaxingSounds[index]['eachSoundAudioObj'].volume = currentVolume / 100;

  }

  removeSound(index: number, categoryId: number, soundId: number): void {
    console.log('remove sound');
    this.choosedRelaxingSounds[index]['eachSoundAudioObj'].pause();
    this.choosedRelaxingSounds.splice(index, 1);

    this.enableSelectSoundOnSoundModelSelection(categoryId, soundId); // whenever sound is remove from home then on add up sound model we can now re-add it to home page.

    const savedSoundIdList = [...JSON.parse(localStorage.getItem('RelaxingSounds')!)];
    const removeMatchingIdIndexFound = savedSoundIdList.findIndex(singleSound => singleSound['categoryId'] == categoryId && singleSound['soundId'] == soundId);
    savedSoundIdList.splice(removeMatchingIdIndexFound, 1);
    localStorage.setItem('RelaxingSounds', JSON.stringify(savedSoundIdList));
  }

  enableSelectSoundOnSoundModelSelection(categoryId: number, soundId: number): void {
    const category = this.categoriesWithItsRelaxingSounds.find(
      singleCategory => singleCategory['categoryId'] === categoryId
    );

    if (category) {
      const sound = category.relaxingSounds.find(
        (singleSound: any) => singleSound.soundId === soundId
      );

      if (sound) {
        sound.isAlreadySelected = false;
      }
    }
  }

  // ********************** Add relaxing model sound section **********************

  @ViewChild('AddRelaxingSoundModal') AddRelaxingSoundModalRef!: ElementRef;
  private _bootstrapModalInstance: any;
  addOnSelectedRelaxingSoundId = 0;
  selectedRelaxingSoundAudioObjInSelections: HTMLAudioElement | null = null;
  selectedRelaxingSoundIdAndCategoryId = { categoryId: 0, soundId: 0 };

  ngAfterViewInit(): void {
    this._bootstrapModalInstance = new bootstrap.Modal(this.AddRelaxingSoundModalRef.nativeElement);
  }

  openAddRelaxingSoundModel(): void {
    console.log("on open relaxing sound model done!");
    this._bootstrapModalInstance.show();

  }

  onCloseRelaxingSoundModel(): void {
    console.log("on close relaxing sound model done!");
    this._bootstrapModalInstance.hide();
    this.addOnSelectedRelaxingSoundId = 0;
    this.selectedRelaxingSoundAudioObjInSelections?.pause();
  }

  onAddRelaxingSound(): void {
    this._bootstrapModalInstance.hide();
    if (this.addOnSelectedRelaxingSoundId > 0) {
      this.addOnSelectedRelaxingSoundId = 0;
      this.selectedRelaxingSoundAudioObjInSelections?.pause();

      if (localStorage.getItem("RelaxingSounds")) {
        const categoryIdAndSoundIdList = [...JSON.parse(localStorage.getItem("RelaxingSounds")!)];
        const index = categoryIdAndSoundIdList.findIndex(singleRelaxingSound => singleRelaxingSound['categoryId'] == this.selectedRelaxingSoundIdAndCategoryId.categoryId && singleRelaxingSound['soundId'] == this.selectedRelaxingSoundIdAndCategoryId.soundId);
        if (index > -1)
          categoryIdAndSoundIdList.splice(index, 1);
        else
          categoryIdAndSoundIdList.push(this.selectedRelaxingSoundIdAndCategoryId);

        localStorage.setItem('RelaxingSounds', JSON.stringify(categoryIdAndSoundIdList));


      } else {
        const categoryIdAndSoundIdList = [];
        categoryIdAndSoundIdList.push(this.selectedRelaxingSoundIdAndCategoryId);
        localStorage.setItem('RelaxingSounds', JSON.stringify(categoryIdAndSoundIdList));
      }

      this.getChoosedRelaxingAudioFromLocalStorage();
    }
  }

  selectingRelaxingSoundOnSelectionModel(selectedCategoryId: number, selectedRelaxingSoundId: number, selectedCategoryIndex: number, selectedRelaxingSoundIndex: number): void {
    if (selectedRelaxingSoundId === this.addOnSelectedRelaxingSoundId) {
      // stop if same selected sound pressed again and also change the selection style as well.
      this.addOnSelectedRelaxingSoundId = 0;
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
    }
    else {
      // change select style effect and change the relaxing sound with it as well.
      this.addOnSelectedRelaxingSoundId = selectedRelaxingSoundId;
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
      this.selectedRelaxingSoundAudioObjInSelections = new Audio(this.categoriesWithItsRelaxingSounds[selectedCategoryIndex].relaxingSounds[selectedRelaxingSoundIndex].soundAudioLocation);
      this.selectedRelaxingSoundAudioObjInSelections.play();
      this.selectedRelaxingSoundIdAndCategoryId = { categoryId: selectedCategoryId, soundId: selectedRelaxingSoundId };
    }

  }

}
