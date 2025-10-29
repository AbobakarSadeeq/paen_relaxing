import { Component, ElementRef, ViewChild } from '@angular/core';
import { HomeService } from './home.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  styleUrl: './home.css',
  imports: []
})

// responsiveness issue.

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
      const savedSoundList = [...JSON.parse(localStorage.getItem('RelaxingSounds')!)];
      for (var categoryAndItSelectedSound of savedSoundList) {
        const categoryIdIndex = this.categoriesWithItsRelaxingSounds.findIndex(singleCategory => singleCategory['categoryId'] == categoryAndItSelectedSound['categoryId']);
        const selectedCategoryAllSounds = [...this.categoriesWithItsRelaxingSounds[categoryIdIndex].relaxingSounds];
        const selectedCategorySoundIndex = selectedCategoryAllSounds.findIndex(singleSound => singleSound['soundId'] == categoryAndItSelectedSound['soundId']);
        const categoryId = this.categoriesWithItsRelaxingSounds[categoryIdIndex]['categoryId'];
        const soundId = this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['soundId'];


        // below condition check is it sound already found on home page or not if not then do push it to the list
        if (this.choosedRelaxingSounds.findIndex(singleSound => singleSound['categoryId'] == categoryId &&
          singleSound['soundId'] == soundId) == -1) {

          // add to that sound object which already selected or already in selected home for to not select it again on selecting sound model.
          this.categoriesWithItsRelaxingSounds[categoryIdIndex].relaxingSounds[selectedCategorySoundIndex].isAlreadySelected = true;

          const audio = new Audio(this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['soundAudioLocation']);
          audio.loop = true;
          audio.volume = categoryAndItSelectedSound['soundVolume'] / 100;

          this.choosedRelaxingSounds.push({
            categoryId: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['categoryId'],
            soundId: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['soundId'],
            soundName: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['name'],
            soundLocation: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['soundAudioLocation'],
            soundImage: this.categoriesWithItsRelaxingSounds[categoryIdIndex]['relaxingSounds'][selectedCategorySoundIndex]['soundImageLocation'],
            playPauseSoundState: false,
            soundVolume: categoryAndItSelectedSound['soundVolume'],
            eachSoundAudioObj: audio
          });
        }
      }
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

  saveSoundVolumeState(categoryId: number, soundId: number, event: any): void {
    const volume = parseFloat(event.target.value);
    const savedSoundIdList = [...JSON.parse(localStorage.getItem('RelaxingSounds')!)];
    const index = savedSoundIdList.findIndex(singleSound => singleSound['categoryId'] == categoryId && singleSound['soundId'] == soundId);
    savedSoundIdList[index]['soundVolume'] = volume;
    localStorage.setItem('RelaxingSounds', JSON.stringify(savedSoundIdList));

  }

  removeSound(index: number, categoryId: number, soundId: number): void {
    this.choosedRelaxingSounds[index]['eachSoundAudioObj'].pause();
    this.choosedRelaxingSounds.splice(index, 1);

    this.enableSelectSoundOnSoundModelSelectionAfterRemoveItFromHome(categoryId, soundId); // whenever sound is remove from home then on add up sound model and we can now re-add it to home page.

    const savedSoundIdList = [...JSON.parse(localStorage.getItem('RelaxingSounds')!)];
    const removeMatchingIdIndexFound = savedSoundIdList.findIndex(singleSound => singleSound['categoryId'] == categoryId && singleSound['soundId'] == soundId);
    savedSoundIdList.splice(removeMatchingIdIndexFound, 1);
    localStorage.setItem('RelaxingSounds', JSON.stringify(savedSoundIdList));
  }

  // ********************** Add relaxing model sound section **********************

  @ViewChild('AddRelaxingSoundModal') AddRelaxingSoundModalRef!: ElementRef;
  private _bootstrapModalInstance: any;
  applySoundSelectedStyleOnSoundInSelectingSoundModel = { categoryId: 0, soundId: 0 };
  selectedRelaxingSoundAudioObjInSelections: HTMLAudioElement | null = null;
  selectedRelaxingSoundIdAndCategoryId = { categoryId: 0, soundId: 0, soundVolume: 50 };

  ngAfterViewInit(): void {
    this._bootstrapModalInstance = new bootstrap.Modal(this.AddRelaxingSoundModalRef.nativeElement);
  }

  openAddRelaxingSoundModel(): void {
    this._bootstrapModalInstance.show();
  }

  onCloseRelaxingSoundModel(): void {
    this._bootstrapModalInstance.hide();
    this.applySoundSelectedStyleOnSoundInSelectingSoundModel = { categoryId: 0, soundId: 0 };
    this.selectedRelaxingSoundAudioObjInSelections?.pause();
  }

  onAddRelaxingSound(): void {
    this._bootstrapModalInstance.hide();
    if (this.applySoundSelectedStyleOnSoundInSelectingSoundModel.categoryId > 0 && this.applySoundSelectedStyleOnSoundInSelectingSoundModel.soundId > 0) {
      this.applySoundSelectedStyleOnSoundInSelectingSoundModel = { categoryId: 0, soundId: 0 };
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
    if (selectedCategoryId === this.applySoundSelectedStyleOnSoundInSelectingSoundModel.categoryId && selectedRelaxingSoundId === this.applySoundSelectedStyleOnSoundInSelectingSoundModel.soundId) {
      // stop if same selected sound pressed again and also change the selection style as well.
      this.applySoundSelectedStyleOnSoundInSelectingSoundModel = { categoryId: 0, soundId: 0 };
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
    }
    else {
      // change select style effect and change the relaxing sound with it as well.
      this.applySoundSelectedStyleOnSoundInSelectingSoundModel = { categoryId: selectedCategoryId, soundId: selectedRelaxingSoundId };
      this.selectedRelaxingSoundAudioObjInSelections?.pause();
      this.selectedRelaxingSoundAudioObjInSelections = new Audio(this.categoriesWithItsRelaxingSounds[selectedCategoryIndex].relaxingSounds[selectedRelaxingSoundIndex].soundAudioLocation);
      this.selectedRelaxingSoundAudioObjInSelections.play();
      this.selectedRelaxingSoundIdAndCategoryId = { categoryId: selectedCategoryId, soundId: selectedRelaxingSoundId, soundVolume: 50 };
    }

  }

  enableSelectSoundOnSoundModelSelectionAfterRemoveItFromHome(categoryId: number, soundId: number): void {
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

}
